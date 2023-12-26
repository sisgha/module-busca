import { Injectable } from '@nestjs/common';
import { ISisgeaBuscaGenericListInput } from '@sisgea/spec';
import { IGenericAction } from '../../../infrastructure/IGenericAction';
import { ActorContext } from '../../../infrastructure/iam/actor-context';
import { MeilisearchContainerService } from '../../../infrastructure/meilisearch-container/meilisearch-container.service';
import { BuscaAppResourceCurso } from '../busca-app-resource-curso';
import { ModalidadeType } from '../busca-modalidade/adapters/graphql';
import { CursoListResultType } from './adapters/graphql';

@Injectable()
export class BuscaCursoService {
  constructor(
    //
    private meilisearchContainerService: MeilisearchContainerService,
  ) {} // ...

  async cursoList(actorContext: ActorContext, dto: ISisgeaBuscaGenericListInput): Promise<CursoListResultType> {
    const allowedIds = await actorContext.getAllowedIds(BuscaAppResourceCurso.key, IGenericAction.READ);

    const result = await this.meilisearchContainerService.listResource<ModalidadeType>(BuscaAppResourceCurso.key, dto, allowedIds);

    return {
      ...result,
    };
  }
}
