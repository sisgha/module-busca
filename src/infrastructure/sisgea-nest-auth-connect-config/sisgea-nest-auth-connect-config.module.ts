import { Global, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../environment-config';
import { SisgeaNestAuthConnectConfigProvider } from './providers/sisgea-nest-auth-connect-config.provider';

@Global()
@Module({
  imports: [
    // ...
    EnvironmentConfigModule,
  ],
  providers: [
    // ...
    SisgeaNestAuthConnectConfigProvider,
  ],
  exports: [
    // ...
    SisgeaNestAuthConnectConfigProvider,
  ],
})
export class SisgeaNestAuthConnectConfigModule {}
