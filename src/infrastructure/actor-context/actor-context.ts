import { ForbiddenException } from '@nestjs/common';
import { GenericCanRequest } from '@sisgea/autorizacao-client';
import { IRequestUser } from '@sisgea/sso-nest-client';
import { get } from 'lodash';
import { Actor, ActorUser } from '../authentication';
import { IAuthorizationAction } from '../authorization';
import { SISGEAAutorizacaoConnectContainerService } from '../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';

export class ActorContext {
  constructor(
    // ...

    public readonly sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService,
    public readonly actor: Actor,
  ) {}

  // ...

  static forSystem(sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService) {
    return new ActorContext(sisgeaAutorizacaoClientService, Actor.forInternalSystem());
  }

  static forUser(sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService, userId: string) {
    return new ActorContext(sisgeaAutorizacaoClientService, ActorUser.forUser(userId));
  }

  static forRequestUser(sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService, requestUser: IRequestUser | null) {
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
    await this.ensurePermission(resource, IAuthorizationAction.READ, data);
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