import { ISISGEANestSSOConfig } from '@sisgea/sso-nest-client';
import { IConfigMeiliSearch } from './IConfigMeiliSearch';
import { IConfigMessageBroker } from './IConfigMessageBroker';
import { IConfigRuntime } from './IConfigRuntime';
import { IConfigSISGEAAutorizacao } from './IConfigSISGEAAutorizacao';

export interface IConfig extends IConfigRuntime, ISISGEANestSSOConfig, IConfigMessageBroker, IConfigSISGEAAutorizacao, IConfigMeiliSearch {}
