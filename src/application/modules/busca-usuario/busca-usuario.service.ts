import { Injectable } from '@nestjs/common';
import { IGenericListInput } from '../../../domain';
import { IGenericAction } from '../../../infrastructure/IGenericAction';
import { ActorContext } from '../../../infrastructure/iam/actor-context';
import { MeilisearchContainerService } from '../../../infrastructure/meilisearch-container/meilisearch-container.service';
import { BuscaUsuarioAppResource } from '../index';
import { UsuarioListResultType, UsuarioType } from './busca-usuario-dtos/graphql';

@Injectable()
export class BuscaUsuarioService {
  constructor(
    //
    private meilisearchContainerService: MeilisearchContainerService,
  ) {} // ...

  async usuarioList(actorContext: ActorContext, dto: IGenericListInput): Promise<UsuarioListResultType> {
    const allowedIds = await actorContext.getAllowedIds(BuscaUsuarioAppResource.key, IGenericAction.READ);

    const result = await this.meilisearchContainerService.listResource<UsuarioType>(BuscaUsuarioAppResource.key, dto, allowedIds);

    return {
      ...result,
    };
  }
}
