import { Query, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../../infrastructure/iam/actor-context';
import { ResolveActorContext } from '../../../infrastructure/iam/authentication/decorators/ResolveActorContext';
import { ValidatedArgs } from '../../../infrastructure/zod/decorators';
import { GenericListInputType, GenericListInputZod } from '../_generics';
import { UsuarioListResultType, UsuarioType } from './busca-usuario-dtos/graphql';
import { BuscaUsuarioService } from './busca-usuario.service';

@Resolver(() => UsuarioType)
export class BuscaUsuarioResolver {
  constructor(
    // ...
    private usuarioService: BuscaUsuarioService,
  ) {}

  @Query(() => UsuarioListResultType)
  async usuarioList(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.usuarioService.usuarioList(actorContext, dto);
  }
}
