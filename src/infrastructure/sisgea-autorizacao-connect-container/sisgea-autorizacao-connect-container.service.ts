import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { AllowedResourceResponse, GenericCanRequest, SISGEAAutorizacaoConnect, UsuarioCanRequest } from '@sisgea/autorizacao-client';
import { Channel, createChannel, waitForChannelReady } from 'nice-grpc';
import { IActor, IAuthenticatedEntityType } from '../../domain';
import { ActorUser } from '../authentication';
import { EnvironmentConfigService } from '../environment-config';

const onPromiseError = () => Promise.reject(new ServiceUnavailableException());

@Injectable()
export class SISGEAAutorizacaoConnectContainerService {
  #channel: Channel | null = null;

  constructor(private configService: EnvironmentConfigService) {}

  async setupChannel() {
    if (this.#channel === null) {
      const url = this.configService.getSISGEAAutorizacaoGRPCServer();

      if (url !== null) {
        this.#channel = createChannel(url);
        await waitForChannelReady(this.#channel, new Date(Date.now() + 100000));
      } else {
        throw new InternalServerErrorException();
      }
    }

    return this.#channel;
  }

  async getSISGEAAutorizacaoConnect() {
    const channel = await this.setupChannel();
    return new SISGEAAutorizacaoConnect(channel);
  }

  async getCheckServiceClient() {
    const sisgeaAutorizacaoConnect = await this.getSISGEAAutorizacaoConnect();

    await sisgeaAutorizacaoConnect.connect().catch(onPromiseError);

    const checkServiceClient = sisgeaAutorizacaoConnect.getCheckServiceClient();

    return checkServiceClient;
  }

  async checkInternalSystemCan(canRequest: GenericCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();
    const { can } = await checkServiceClient.internalSystemCan(canRequest).catch(onPromiseError);
    return can;
  }

  async checkAnonymousCan(canRequest: GenericCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();
    const { can } = await checkServiceClient.anonymousCan(canRequest).catch(onPromiseError);
    return can;
  }

  async checkUsuarioCan(canRequest: UsuarioCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();
    const { can } = await checkServiceClient.usuarioCan(canRequest).catch(onPromiseError);
    return can;
  }

  async checkActorCan(actor: IActor, canRequest: GenericCanRequest) {
    if (actor instanceof ActorUser) {
      const usuarioId = actor.userRef.id;

      return this.checkUsuarioCan({
        ...canRequest,
        usuarioId,
      });
    }

    switch (actor.type) {
      case IAuthenticatedEntityType.INTERNAL_SYSTEM: {
        return this.checkInternalSystemCan(canRequest);
      }

      case IAuthenticatedEntityType.ANONONYMOUS: {
        return this.checkAnonymousCan(canRequest);
      }

      default: {
        return false;
      }
    }
  }

  private transformAllowedResourceResponse(allowedResourceResponse: AllowedResourceResponse) {
    const id = JSON.parse(allowedResourceResponse.resourceIdJson);
    return id;
  }

  private async *transformAllowedResourceResponses(allowedResourceResponses: AsyncIterable<AllowedResourceResponse>) {
    for await (const allowedResourceResponse of allowedResourceResponses) {
      yield this.transformAllowedResourceResponse(allowedResourceResponse);
    }
  }

  async *getUsuarioAllowedResourcesIterable(canRequest: UsuarioCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();

    try {
      const allowedResources = checkServiceClient.usuarioAllowedResources(canRequest);
      yield* allowedResources;
    } catch (e) {
      await onPromiseError();
    }
  }

  async *getAnonymousAllowedResourcesIterable(canRequest: GenericCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();

    try {
      const allowedResources = checkServiceClient.anonymousAllowedResources(canRequest);
      yield* allowedResources;
    } catch (e) {
      await onPromiseError();
    }
  }

  async *getInternalSystemAllowedResourcesIterable(canRequest: GenericCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();

    try {
      const allowedResources = checkServiceClient.internalSystemAllowedResources(canRequest);
      yield* allowedResources;
    } catch (e) {
      await onPromiseError();
    }
  }

  async *getActorAllowedResourcesIterable(actor: IActor, canRequest: GenericCanRequest) {
    if (actor instanceof ActorUser) {
      const usuarioId = actor.userRef.id;

      yield* this.getUsuarioAllowedResourcesIterable({
        ...canRequest,
        usuarioId,
      });
    }

    switch (actor.type) {
      case IAuthenticatedEntityType.INTERNAL_SYSTEM: {
        yield* this.getInternalSystemAllowedResourcesIterable(canRequest);
      }

      case IAuthenticatedEntityType.ANONONYMOUS: {
        yield* this.getAnonymousAllowedResourcesIterable(canRequest);
      }

      default: {
        break;
      }
    }
  }

  async *getActorAllowedIdsIterable(actor: IActor, canRequest: GenericCanRequest) {
    const allowedResources = this.getActorAllowedResourcesIterable(actor, canRequest);
    yield* this.transformAllowedResourceResponses(allowedResources);
  }

  async getActorAllowedIds<T = string | number>(actor: IActor, canRequest: GenericCanRequest) {
    const allowedIds: T[] = [];

    for await (const id of this.getActorAllowedIdsIterable(actor, canRequest)) {
      allowedIds.push(id);
    }

    return allowedIds;
  }
}
