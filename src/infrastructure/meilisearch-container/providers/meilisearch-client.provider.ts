import { Provider } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { EnvironmentConfigService } from '../../environment-config';
import { MEILISEARCH_CLIENT } from '../tokens/MEILISEARCH_CLIENT';
import { MeilisearchSetupUtil } from '../utils/meilisearch-setup-util';

export const meiliSearchClientProvider: Provider = {
  provide: MEILISEARCH_CLIENT,

  useFactory: async (environmentConfigService: EnvironmentConfigService) => {
    const { host, apiKey } = environmentConfigService.getMeiliSearchConfig();
    const client = new MeiliSearch({ host, apiKey });
    await MeilisearchSetupUtil.setupInstance(client);
    return client;
  },

  inject: [
    // ...
    EnvironmentConfigService,
  ],
};
