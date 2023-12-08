import { Global, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../environment-config';
import { sisgeaNestSSOContextProvider } from './providers/sisgea-nest-sso-context.provider';

@Global()
@Module({
  imports: [
    // ...
    EnvironmentConfigModule,
  ],
  providers: [
    // ...
    sisgeaNestSSOContextProvider,
  ],
  exports: [
    // ...
    sisgeaNestSSOContextProvider,
  ],
})
export class SISGEANestSSOContextModule {}
