import { IAuthenticatedEntityType, IActor } from '../../../domain';

export class Actor implements IActor {
  constructor(
    // ...
    readonly type: IAuthenticatedEntityType = IAuthenticatedEntityType.ANONONYMOUS,
  ) {}

  static forAnonymous() {
    return new Actor(IAuthenticatedEntityType.ANONONYMOUS);
  }

  static forInternalSystem() {
    return new Actor(IAuthenticatedEntityType.INTERNAL_SYSTEM);
  }
}
