import { Injectable, PipeTransform } from '@nestjs/common';
import { IRequestUser } from '@sisgea/sso-nest-client';
import { RequestUserSSOGql } from '@sisgea/sso-nest-client/dist/application/gql';
import { ActorContext } from '../../actor-context';

import { SISGEAAutorizacaoConnectContainerService } from '../../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';

@Injectable()
export class ResolveActorContextPipe implements PipeTransform {
  constructor(
    //

    private sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService,
  ) {}

  async transform(requestUser: IRequestUser | null /* _metadata: ArgumentMetadata */) {
    return ActorContext.forRequestUser(this.sisgeaAutorizacaoClientService, requestUser);
  }
}

export const ResolveActorContext = (options?: any) => RequestUserSSOGql(options, ResolveActorContextPipe);
