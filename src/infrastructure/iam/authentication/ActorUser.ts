import { IRequestUser } from '@sisgea/sso-nest-client';
import { IAuthenticatedEntityType, IActorUser, IAuthenticatedUserRef } from '../../../domain';
import { Actor } from './Actor';

export class ActorUser extends Actor implements IActorUser {
  userRef: IAuthenticatedUserRef;

  readonly type: IAuthenticatedEntityType.USUARIO = IAuthenticatedEntityType.USUARIO;

  constructor(userRef: IAuthenticatedUserRef) {
    super();
    this.userRef = userRef;
  }

  static forUserRef(userRef: IAuthenticatedUserRef) {
    return new ActorUser(userRef);
  }

  static forUser(userId: string) {
    const userRef: IAuthenticatedUserRef = { id: userId };
    return ActorUser.forUserRef(userRef);
  }

  static forRequestUser(requestUser: IRequestUser | null) {
    if (requestUser !== null) {
      return ActorUser.forUser(requestUser.sub);
    }

    return ActorUser.forAnonymous();
  }
}
