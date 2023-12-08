import { Provider } from '@nestjs/common';
import { SISGEAAutorizacaoConnectContainerService } from '../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';
import { ActorContext } from '../actor-context';

export const ACTOR_CONTEXT_SYSTEM = Symbol();

export const actorContextSystemProvider: Provider = {
  provide: ACTOR_CONTEXT_SYSTEM,

  useFactory: async (
    //
    sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService,
  ) => {
    return ActorContext.forSystem(sisgeaAutorizacaoClientService);
  },

  inject: [
    //

    SISGEAAutorizacaoConnectContainerService,
  ],
};
