import { Injectable } from '@nestjs/common';
import { ISisgeaBuscaGenericListInput } from '@sisgea/spec';
import { IGenericAction } from '../../../infrastructure/IGenericAction';
import { ActorContext } from '../../../infrastructure/iam/actor-context';
import { MeilisearchContainerService } from '../../../infrastructure/meilisearch-container/meilisearch-container.service';
import { BuscaAppResourceModalidade } from '../busca-app-resource-modalidade';
import { ModalidadeListResultType, ModalidadeType } from './adapters/graphql';

@Injectable()
export class BuscaModalidadeService {
  constructor(
    //
    private meilisearchContainerService: MeilisearchContainerService,
  ) {} // ...

  async modalidadeList(actorContext: ActorContext, dto: ISisgeaBuscaGenericListInput): Promise<ModalidadeListResultType> {
    const allowedIds = await actorContext.getAllowedIds(BuscaAppResourceModalidade.key, IGenericAction.READ);

    const result = await this.meilisearchContainerService.listResource<ModalidadeType>(BuscaAppResourceModalidade.key, dto, allowedIds);

    return {
      ...result,
    };
  }
}
