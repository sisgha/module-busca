import { Module } from '@nestjs/common';
import { BuscaModalidadeResolver } from './adapters/graphql/busca-modalidade.resolver';
import { BuscaModalidadeService } from './busca-modalidade.service';

@Module({
  imports: [
    // ...
  ],
  exports: [
    // ...
    BuscaModalidadeService,
  ],
  providers: [
    // ...
    BuscaModalidadeService,
    BuscaModalidadeResolver,
  ],
})
export class BuscaModalidadeModule {}
