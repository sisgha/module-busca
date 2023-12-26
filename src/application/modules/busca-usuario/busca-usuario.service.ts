import { Injectable } from '@nestjs/common';
import { ISisgeaBuscaGenericListInput } from '@sisgea/spec';
import { IGenericAction } from '../../../infrastructure/IGenericAction';
import { ActorContext } from '../../../infrastructure/iam/actor-context';
import { MeilisearchContainerService } from '../../../infrastructure/meilisearch-container/meilisearch-container.service';
import { UsuarioListResultType, UsuarioType } from './busca-usuario-dtos/graphql';
import { BuscaUsuarioAppResource } from './busca-usuario.app-resource';

@Injectable()
export class BuscaUsuarioService {
  constructor(
    //
    private meilisearchContainerService: MeilisearchContainerService,
  ) {} // ...

  async usuarioList(actorContext: ActorContext, dto: ISisgeaBuscaGenericListInput): Promise<UsuarioListResultType> {
    const allowedIds = await actorContext.getAllowedIds(BuscaUsuarioAppResource.key, IGenericAction.READ);

    const result = await this.meilisearchContainerService.listResource<UsuarioType>(BuscaUsuarioAppResource.key, dto, allowedIds);

    return {
      ...result,
    };
  }
}
