import { ISisgeaNestAuthConnectConfig } from '@sisgea/nest-auth-connect';
import { IConfigMeiliSearch } from './IConfigMeiliSearch';
import { IConfigMessageBroker } from './IConfigMessageBroker';
import { IConfigRuntime } from './IConfigRuntime';
import { IConfigSISGEAAutorizacao } from './IConfigSISGEAAutorizacao';

export interface IConfig
  extends IConfigRuntime,
    ISisgeaNestAuthConnectConfig,
    IConfigMessageBroker,
    IConfigSISGEAAutorizacao,
    IConfigMeiliSearch {}
