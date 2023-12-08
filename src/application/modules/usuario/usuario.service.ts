import { Injectable } from '@nestjs/common';
import { IGenericListInput } from '../../../domain';
import { ActorContext } from '../../../infrastructure/actor-context';
import { ModuleBuscaAppResourceUsuario } from '../../../infrastructure/module-busca-app-resources';
import { IAuthorizationAction } from '../../../infrastructure/authorization';
import { MeilisearchContainerService } from '../../../infrastructure/meilisearch-container/meilisearch-container.service';
import { UsuarioListResultType, UsuarioType } from '../../module-busca-dtos/usuario/graphql';

@Injectable()
export class UsuarioService {
  constructor(
    //
    private meilisearchContainerService: MeilisearchContainerService,
  ) {} // ...

  async usuarioList(actorContext: ActorContext, dto: IGenericListInput): Promise<UsuarioListResultType> {
    const allowedIds = await actorContext.getAllowedIds(ModuleBuscaAppResourceUsuario.key, IAuthorizationAction.READ);

    const result = await this.meilisearchContainerService.listResource<UsuarioType>(ModuleBuscaAppResourceUsuario.key, dto, allowedIds);

    return {
      ...result,
    };
  }
}
