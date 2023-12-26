import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { SisgeaNestAuthConnectModule } from '@sisgea/nest-auth-connect';
import { AuthenticatedGqlGuard } from '@sisgea/nest-auth-connect/dist/modules/sisgea-nest-auth-protect/gql';
import { GqlExceptionFilter } from '../infrastructure/api-app/filters/GqlExceptionFilter';
import { EnvironmentConfigModule } from '../infrastructure/environment-config';
import { ActorContextModule } from '../infrastructure/iam/actor-context';
import { MeilisearchContainerModule } from '../infrastructure/meilisearch-container/meilisearch-container.module';
import { MessageBrokerContainerModule } from '../infrastructure/message-broker-container/message-broker-container.module';
import { MessageBrokerSubscriptionsModule } from '../infrastructure/message-broker-subscriptions/message-broker-subscriptions.module';
import { SisgeaAutorizacaoConnectContainerModule } from '../infrastructure/sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.module';
import { SisgeaNestAuthConnectConfigModule } from '../infrastructure/sisgea-nest-auth-connect-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuscaCursoModule } from './modules/busca-curso/busca-curso.module';
import { BuscaModalidadeModule } from './modules/busca-modalidade/busca-modalidade.module';
import { BuscaUsuarioModule } from './modules/busca-usuario/busca-usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    ScheduleModule.forRoot(),

    EnvironmentConfigModule,

    //
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,

      autoSchemaFile: true,

      introspection: true,

      cache: new InMemoryLRUCache({
        // ~100MiB
        maxSize: Math.pow(2, 20) * 100,
        // 5 minutes (in milliseconds)
        ttl: 5 * 60 * 1000,
      }),
    }),

    //

    SisgeaNestAuthConnectConfigModule,
    SisgeaNestAuthConnectModule,

    //

    SisgeaAutorizacaoConnectContainerModule,

    //

    MessageBrokerContainerModule,

    //

    MeilisearchContainerModule,

    //

    ActorContextModule,

    //

    MessageBrokerSubscriptionsModule,

    //

    BuscaUsuarioModule,

    BuscaModalidadeModule,
    BuscaCursoModule,
  ],

  controllers: [
    //
    AppController,
  ],

  providers: [
    //

    {
      provide: APP_GUARD,
      useClass: AuthenticatedGqlGuard,
    },

    {
      provide: APP_FILTER,
      useClass: GqlExceptionFilter,
    },

    AppService,
  ],
})
export class AppModule {}
