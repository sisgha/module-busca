import { Module } from '@nestjs/common';
import { BuscaUsuarioResolver } from './busca-usuario.resolver';
import { BuscaUsuarioService } from './busca-usuario.service';

@Module({
  imports: [
    // ...
  ],
  exports: [
    // ...
    BuscaUsuarioService,
  ],
  providers: [
    // ...
    BuscaUsuarioService,
    BuscaUsuarioResolver,
  ],
})
export class BuscaUsuarioModule {}
