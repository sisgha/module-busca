import { IAuthenticatedEntityType } from '../authentication';

export interface IActor<T extends IAuthenticatedEntityType = IAuthenticatedEntityType> {
  readonly type: T;
}
