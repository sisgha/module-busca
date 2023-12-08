import { Global, Module } from '@nestjs/common';
import { MeilisearchContainerService } from './meilisearch-container.service';
import { meiliSearchClientProvider } from './providers/meilisearch-client.provider';

@Global()
@Module({
  imports: [
    // ...
  ],
  providers: [
    // ...
    meiliSearchClientProvider,
    MeilisearchContainerService,
  ],
  exports: [
    // ...
    meiliSearchClientProvider,
    MeilisearchContainerService,
  ],
})
export class MeilisearchContainerModule {}
