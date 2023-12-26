import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ISisgeaNestAuthConnectConfigKeycloakCredentials,
  ISisgeaNestAuthConnectConfigOidcClientCredentials,
} from '@sisgea/nest-auth-connect';
import { IConfig, IConfigMeiliSearchCredentials } from '../../domain';

@Injectable()
export class EnvironmentConfigService implements IConfig {
  constructor(
    // ...
    private nestConfigService: ConfigService,
  ) {}

  getMeiliSearchHost(): string | null {
    const host = this.nestConfigService.get<string>('MEILISEARCH_HOST') ?? null;
    return host;
  }

  getMeiliSearchApiKey(): string | null {
    const apiKey = this.nestConfigService.get<string>('MEILISEARCH_API_KEY') ?? null;
    return apiKey;
  }

  getMeiliSearchConfig(): IConfigMeiliSearchCredentials {
    const host = this.getMeiliSearchHost();
    const apiKey = this.getMeiliSearchApiKey();

    if (host === null || apiKey === null) {
      throw new Error('Please provide the following meilisearch credentials: MEILISEARCH_HOST, MEILISEARCH_API_KEY.');
    }

    return {
      host,
      apiKey,
    };
  }

  getSISGEAAutorizacaoGRPCServer(): string | null {
    const url = this.nestConfigService.get<string | string>('SISGEA_AUTORIZACAO_GRPC_SERVER') ?? null;
    return url;
  }

  getRuntimePort(): number {
    const configPort = this.nestConfigService.get<number | string>('PORT') ?? null;

    if (configPort !== null) {
      const configPortAsNumber = parseInt(String(configPort));

      if (!Number.isNaN(configPortAsNumber)) {
        return configPortAsNumber;
      }
    }

    return 3471;
  }

  getRuntimeNodeEnv(): string {
    const runtimeNodeEnv = (this.nestConfigService.get<string>('NODE_ENV') ?? 'production').trim().toLocaleLowerCase();

    return runtimeNodeEnv;
  }

  getRuntimeIsProduction(): boolean {
    return this.getRuntimeNodeEnv() === 'production';
  }

  getRuntimeIsDevelopment(): boolean {
    return !this.getRuntimeIsProduction();
  }

  //

  getOidcClientCredentials(): ISisgeaNestAuthConnectConfigOidcClientCredentials {
    const issuer = this.nestConfigService.get<string>('OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER');
    const clientId = this.nestConfigService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID');
    const clientSecret = this.nestConfigService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET');

    if (issuer === undefined || clientId === undefined || clientSecret === undefined) {
      throw new Error('Please provide correct OAUTH2_CLIENT credentials.');
    }

    return {
      issuer,
      clientId,
      clientSecret,
    };
  }

  //

  getKeycloakConfigCredentials(): ISisgeaNestAuthConnectConfigKeycloakCredentials {
    throw new Error('getKeyCloakConfigCredentials: not implemented');
  }

  //

  getMessageBrokerConnectionURL(): string | undefined {
    return this.nestConfigService.get<string>('MESSAGE_BROKER_CONNECTION_URL');
  }

  //
}
