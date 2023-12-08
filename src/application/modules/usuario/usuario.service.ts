import { Injectable } from '@nestjs/common';
import { IGenericListInput } from '../../../domain';
import { ActorContext } from '../../../infrastructure/actor-context';
import { ModuleBuscaAppResourceUsuario } from '../../../infrastructure/module-busca-app-resources';
import { MeilisearchContainerService } from '../../../infrastructure/meilisearch-container/meilisearch-container.service';
import { UsuarioListResultType, UsuarioType } from '../../dtos-module-busca/usuario/graphql';
import { IGenericAction } from '../../../infrastructure/IGenericAction';

@Injectable()
export class UsuarioService {
  constructor(
    //
    private meilisearchContainerService: MeilisearchContainerService,
  ) {} // ...

  async usuarioList(actorContext: ActorContext, dto: IGenericListInput): Promise<UsuarioListResultType> {
    const allowedIds = await actorContext.getAllowedIds(ModuleBuscaAppResourceUsuario.key, IGenericAction.READ);

    const result = await this.meilisearchContainerService.listResource<UsuarioType>(ModuleBuscaAppResourceUsuario.key, dto, allowedIds);

    return {
      ...result,
    };
  }
}
