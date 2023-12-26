import { Query, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../../../../infrastructure/iam/actor-context';
import { ResolveActorContext } from '../../../../../infrastructure/iam/authentication/decorators/ResolveActorContext';
import { ValidatedArgs } from '../../../../../infrastructure/zod/decorators';
import { GenericListInputType, GenericListInputZod } from '../../../busca';
import { BuscaModalidadeService } from '../../busca-modalidade.service';
import { ModalidadeType, ModalidadeListResultType } from './types';

@Resolver(() => ModalidadeType)
export class BuscaModalidadeResolver {
  constructor(
    // ...
    private buscaModalidadeService: BuscaModalidadeService,
  ) {}

  @Query(() => ModalidadeListResultType)
  async modalidadeList(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.buscaModalidadeService.modalidadeList(actorContext, dto);
  }
}
