import { ForbiddenException, Injectable } from '@nestjs/common';
import { GenericCanRequest } from '@sisgea/autorizacao-client';
import { IRequestUser } from '@sisgea/nest-auth-connect';
import { get } from 'lodash';
import { IGenericAction } from '../../IGenericAction';
import { SisgeaAutorizacaoConnectContainerService } from '../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';
import { Actor, ActorUser } from '../authentication';

@Injectable()
export class ActorContext {
  private actor: Actor = Actor.forAnonymous();

  constructor(
    // ...

    public readonly sisgeaAutorizacaoClientService: SisgeaAutorizacaoConnectContainerService,

    actor?: Actor,
  ) {
    if (actor) {
      this.setActor(actor);
    }
  }

  setActor(actor: Actor) {
    this.actor = actor;
  }

  // ...

  static forSystem(sisgeaAutorizacaoClientService: SisgeaAutorizacaoConnectContainerService) {
    return new ActorContext(sisgeaAutorizacaoClientService, Actor.forInternalSystem());
  }

  static forUser(sisgeaAutorizacaoClientService: SisgeaAutorizacaoConnectContainerService, userId: string) {
    return new ActorContext(sisgeaAutorizacaoClientService, ActorUser.forUser(userId));
  }

  static forRequestUser(sisgeaAutorizacaoClientService: SisgeaAutorizacaoConnectContainerService, requestUser: IRequestUser | null) {
    const actor = ActorUser.forRequestUser(requestUser);
    return new ActorContext(sisgeaAutorizacaoClientService, actor);
  }

  // ...

  //

  async can(resource: string, action: string, data: any, field: string | string[] | null = null) {
    const resourceIdJson = JSON.stringify(get(data, 'id', null));

    const genericCan: GenericCanRequest = {
      action,
      resource,
      resourceIdJson,
    };

    //

    return this.sisgeaAutorizacaoClientService.checkActorCan(this.actor, genericCan);
  }

  async readResource(resource: string, data: any) {
    await this.ensurePermission(resource, IGenericAction.READ, data);
    return data;
  }

  async ensurePermission(resource: string, action: string, data: any, field: string | string[] | null = null) {
    const isAllowed = await this.can(resource, action, data, field);

    if (!isAllowed) {
      throw new ForbiddenException(`The actor is not allowed to perform the action '${action}' on resource '${resource}'.`);
    }

    return true;
  }

  async getAllowedIds(resource: string, action: string) {
    const genericCan: GenericCanRequest = {
      action,
      resource,
      resourceIdJson: JSON.stringify(null),
    };

    const allowedIds = this.sisgeaAutorizacaoClientService.getActorAllowedIds(this.actor, genericCan);

    return allowedIds;
  }
}
