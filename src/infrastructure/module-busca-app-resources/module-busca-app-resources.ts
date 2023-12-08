import { IModuleBuscaAppResource } from '../../domain';
import { ModuleBuscaAppResourceUsuario } from './module-busca-app-resource-usuario';

export const ModuleBuscaAppResources: IModuleBuscaAppResource[] = [
  //
  ModuleBuscaAppResourceUsuario,
];

export const getAppResourceByKey = (key: string) => {
  return ModuleBuscaAppResources.find((i) => i.key === key) ?? null;
};
