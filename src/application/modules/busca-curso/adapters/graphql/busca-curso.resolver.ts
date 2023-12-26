import { Query, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../../../../infrastructure/iam/actor-context';
import { ResolveActorContext } from '../../../../../infrastructure/iam/authentication/decorators/ResolveActorContext';
import { ValidatedArgs } from '../../../../../infrastructure/zod/decorators';
import { GenericListInputType, GenericListInputZod } from '../../../busca';
import { BuscaCursoService } from '../../busca-curso.service';
import { ModalidadeType } from '../../../busca-modalidade/adapters/graphql';
import { CursoListResultType } from './types';

@Resolver(() => ModalidadeType)
export class BuscaCursoResolver {
  constructor(
    // ...
    private buscaCursoService: BuscaCursoService,
  ) {}

  @Query(() => CursoListResultType)
  async cursoList(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.buscaCursoService.cursoList(actorContext, dto);
  }
}
