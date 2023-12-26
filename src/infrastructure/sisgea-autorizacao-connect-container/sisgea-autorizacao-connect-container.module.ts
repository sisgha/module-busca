import { Global, Module } from '@nestjs/common';
import { SisgeaAutorizacaoConnectContainerService } from './sisgea-autorizacao-connect-container.service';

@Global()
@Module({
  imports: [],
  exports: [
    //
    SisgeaAutorizacaoConnectContainerService,
  ],
  providers: [
    //
    SisgeaAutorizacaoConnectContainerService,
  ],
})
export class SisgeaAutorizacaoConnectContainerModule {}
