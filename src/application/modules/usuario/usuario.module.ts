import { Module } from '@nestjs/common';
import { UsuarioResolver } from '../../adapters/graphql/usuario.resolver';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [
    // ...
  ],
  exports: [
    // ...
    UsuarioService,
  ],
  providers: [
    // ...
    UsuarioService,
    UsuarioResolver,
  ],
})
export class UsuarioModule {}
