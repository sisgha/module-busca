import { Provider } from '@nestjs/common';
import { ISISGEANestSSOContext, SISGEA_NEST_SSO_CONTEXT } from '@sisgea/sso-nest-client';
import { EnvironmentConfigService } from '../../environment-config';

export const sisgeaNestSSOContextProvider: Provider<ISISGEANestSSOContext> = {
  provide: SISGEA_NEST_SSO_CONTEXT,

  useFactory: (environmentConfigService: EnvironmentConfigService) => {
    const sisgeaNestSSOContext: ISISGEANestSSOContext = {
      configService: environmentConfigService,
    };

    return sisgeaNestSSOContext;
  },

  inject: [EnvironmentConfigService],
};
