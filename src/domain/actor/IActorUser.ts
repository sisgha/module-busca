import { IAuthenticatedEntityType, IAuthenticatedUserRef } from '../authentication';
import { IActor } from './IActor';

export interface IActorUser extends IActor<IAuthenticatedEntityType.USUARIO> {
  userRef: IAuthenticatedUserRef;
}
