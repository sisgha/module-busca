import { Injectable, PipeTransform } from '@nestjs/common';
import { IRequestUser } from '@sisgea/nest-auth-connect';
import { SisgeaRequestUserGql } from '@sisgea/nest-auth-connect/dist/modules/sisgea-nest-auth-protect/gql';
import { ActorContext } from '../../actor-context';

import { SisgeaAutorizacaoConnectContainerService } from '../../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';

@Injectable()
export class ResolveActorContextPipe implements PipeTransform {
  constructor(
    //

    private sisgeaAutorizacaoClientService: SisgeaAutorizacaoConnectContainerService,
  ) {}

  async transform(requestUser: IRequestUser | null /* _metadata: ArgumentMetadata */) {
    return ActorContext.forRequestUser(this.sisgeaAutorizacaoClientService, requestUser);
  }
}

export const ResolveActorContext = (options?: any) => SisgeaRequestUserGql(options, ResolveActorContextPipe);
