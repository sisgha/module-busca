import { Global, Module } from '@nestjs/common';
import { actorContextProviders } from './providers/actor-context.providers';

@Global()
@Module({
  providers: [
    //
    ...actorContextProviders,
  ],
  exports: [
    //
    ...actorContextProviders,
  ],
})
export class ActorContextModule {}
