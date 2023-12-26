import { Provider } from '@nestjs/common';
import { SisgeaAutorizacaoConnectContainerService } from '../../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';
import { ActorContext } from '../actor-context';

export const ACTOR_CONTEXT_SYSTEM = Symbol();

export const actorContextSystemProvider: Provider = {
  provide: ACTOR_CONTEXT_SYSTEM,

  useFactory: async (
    //
    sisgeaAutorizacaoClientService: SisgeaAutorizacaoConnectContainerService,
  ) => {
    return ActorContext.forSystem(sisgeaAutorizacaoClientService);
  },

  inject: [
    //

    SisgeaAutorizacaoConnectContainerService,
  ],
};
