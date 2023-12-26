import { Module } from '@nestjs/common';
import { BuscaCursoResolver } from './adapters/graphql/busca-curso.resolver';
import { BuscaCursoService } from './busca-curso.service';

@Module({
  imports: [
    // ...
  ],
  exports: [
    // ...
    BuscaCursoService,
  ],
  providers: [
    // ...
    BuscaCursoService,
    BuscaCursoResolver,
  ],
})
export class BuscaCursoModule {}
