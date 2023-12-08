import { Module } from '@nestjs/common';
import { SISGEANestSSOKcContainerModule, SISGEANestSSOOIDCClientContainerModule } from '@sisgea/sso-nest-client';
import { KCClientService } from './kc-client.service';

@Module({
  imports: [
    //
    SISGEANestSSOKcContainerModule,
    SISGEANestSSOOIDCClientContainerModule,
  ],
  providers: [
    //
    KCClientService,
  ],
  exports: [
    //
    KCClientService,
  ],
})
export class KCClientModule {}
