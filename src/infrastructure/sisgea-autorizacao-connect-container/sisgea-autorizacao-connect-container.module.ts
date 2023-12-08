import { Global, Module } from '@nestjs/common';
import { SISGEAAutorizacaoConnectContainerService } from './sisgea-autorizacao-connect-container.service';

@Global()
@Module({
  imports: [],
  exports: [
    //
    SISGEAAutorizacaoConnectContainerService,
  ],
  providers: [
    //
    SISGEAAutorizacaoConnectContainerService,
  ],
})
export class SISGEAAutorizacaoConnectContainerModule {}
