import { Injectable, OnModuleInit } from '@nestjs/common';
import { SisgeaDbEventModel } from '@sisgea/spec';
import { Message } from 'amqplib';
import { AckOrNack, SubscriberSessionAsPromised } from 'rascal';
import { getAppResourceByKey } from '../../application/modules/busca-app-resources';
import { MeilisearchContainerService } from '../meilisearch-container/meilisearch-container.service';
import { MessageBrokerContainerService } from '../message-broker-container/message-broker-container.service';
import { extractDbEventDataDateUpdated } from '../sisgea-db-events-common/db-event-utils/extract-db-event-date-updated';
import { parseDbEvent } from '../sisgea-db-events-common/db-event-utils/parse-db-event';
import { PlaceholderUndefined } from '../sisgea-db-events-common/db-event-utils/placeholder-undefined';
import { DbEventAction } from '../sisgea-db-events-common/domain/DbEventAction';
import { HandleDbEventOutputReason } from '../sisgea-db-events-common/domain/HandleDbEventOutputReason';

type HandleOutput =
  | {
      success: true;
      reason: null;
    }
  | {
      success: false;
      reason: HandleDbEventOutputReason;
    };

@Injectable()
export class MessageBrokerSubscriptionDbEventsService implements OnModuleInit {
  #subscription: SubscriberSessionAsPromised | null = null;

  constructor(
    //
    private messageBrokerContainerService: MessageBrokerContainerService,
    private meilisearchContainerService: MeilisearchContainerService,
  ) {}

  onModuleInit() {
    this.setup();
  }

  async setup() {
    if (!this.#subscription) {
      const broker = await this.messageBrokerContainerService.getBroker();

      const subscription = await broker.subscribe('module_busca_db_event_sub');

      subscription.on('message', this.handleMessageBrokerIncomingDbEventMessage.bind(this));
      subscription.on('error', this.handleMessageBrokerIncomingDBEventError.bind(this));

      this.#subscription = subscription;
    }
  }

  async handleIncomingDbEvent(dbEvent: SisgeaDbEventModel): Promise<HandleOutput> {
    const appResource = getAppResourceByKey(dbEvent.resource);

    const resourceIndex = await this.meilisearchContainerService.getIndexForAppResource(appResource);

    if (appResource && resourceIndex) {
      const dbEventData = dbEvent.data ?? null;
      const dbEventProjectionDateUpdated = extractDbEventDataDateUpdated(dbEventData);

      const localProjectionData = await resourceIndex.getDocument(<any>dbEvent.rowId).catch(() => null);
      const localProjectionDateUpdated = extractDbEventDataDateUpdated(localProjectionData);

      switch (dbEvent.action) {
        case DbEventAction.CREATE:
        case DbEventAction.INSERT:
        case DbEventAction.UPDATE: {
          // dbEventProjectionDateUpdated === PlaceholderUndefined => never when action in insert or update
          // dbEventProjectionDateUpdated < localProjectionDateUpdated => outdated data coming
          // localProjectionDateUpdated === PlaceholderUndefined => there is no local projection
          // dbEventProjectionDateUpdated > localProjectionDateUpdated => new data coming

          if (dbEventProjectionDateUpdated === PlaceholderUndefined) {
            return {
              success: false,
              reason: HandleDbEventOutputReason.INVALID_DB_EVENT,
            };
          } else if (localProjectionDateUpdated !== PlaceholderUndefined && dbEventProjectionDateUpdated < localProjectionDateUpdated) {
            // outdated db event, just skip
            return {
              success: true,
              reason: null,
            };
          } else if (
            localProjectionDateUpdated === PlaceholderUndefined ||
            (localProjectionData && dbEventProjectionDateUpdated > localProjectionDateUpdated)
          ) {
            await this.meilisearchContainerService.performRecordsUpdate(appResource, [dbEventData]);

            return {
              success: true,
              reason: null,
            };
          }

          break;
        }

        case DbEventAction.DELETE: {
          // localProjection is not null => there is local projection
          // localProjection is null => no local projection exists

          if (localProjectionData !== null) {
            await this.meilisearchContainerService.performRecordsDelete(appResource, [localProjectionData]);
          }

          return {
            success: true,
            reason: null,
          };
        }
      }
    }

    return {
      success: false,
      reason: HandleDbEventOutputReason.ERROR_UNKNOWN,
    };
  }

  async handleMessageBrokerIncomingDbEventMessage(message: Message, content: any, ackOrNack: AckOrNack) {
    const messageContent = message.content.toString();
    const parseOutput = await parseDbEvent(messageContent);

    let outputReason: HandleDbEventOutputReason | null = null;

    if (parseOutput.success) {
      const handleOutput = await this.handleIncomingDbEvent(parseOutput.data);

      if (handleOutput.success) {
        outputReason = null;
      } else {
        console.debug({ handleOutput });
        outputReason = handleOutput.reason;
      }
    } else {
      console.debug({ parseOutput });
      outputReason = parseOutput.reason;
    }

    switch (outputReason) {
      case null: {
        ackOrNack(undefined, { strategy: 'ack' });
        break;
      }

      default:
      case HandleDbEventOutputReason.ERROR_UNKNOWN:
      case HandleDbEventOutputReason.INVALID_DB_EVENT: {
        console.debug(JSON.stringify(parseOutput.data, null, 2));

        console.error(`Could not properly handle db event (queue message id: ${message.properties.messageId})`);

        ackOrNack(new Error(String(outputReason)), { strategy: 'nack', defer: 1000, requeue: true });
        break;
      }
    }
  }

  handleMessageBrokerIncomingDBEventError(err: Error): void {
    console.error('Subscriber error', err);
  }
}
