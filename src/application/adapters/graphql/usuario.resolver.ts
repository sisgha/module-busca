import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../../infrastructure/actor-context';
import { ACTOR_CONTEXT_SYSTEM } from '../../../infrastructure/actor-context/providers/actor-context-system.provider';
import { ResolveActorContext } from '../../../infrastructure/authentication/decorators/ResolveActorContext';
import { ValidatedArgs } from '../../../infrastructure/zod/decorators';
import { GenericListInputType } from '../../dtos-module-busca/_generics/graphql/generic-list-input.type';
import { GenericListInputZod } from '../../dtos-module-busca/_generics/zod/generic-list-input.zod';
import { UsuarioListResultType, UsuarioType } from '../../dtos-module-busca/usuario/graphql';

import { UsuarioService } from '../../modules/usuario/usuario.service';

@Resolver(() => UsuarioType)
export class UsuarioResolver {
  constructor(
    // ...
    private usuarioService: UsuarioService,

    @Inject(ACTOR_CONTEXT_SYSTEM)
    private actorContextSystem: ActorContext,
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
