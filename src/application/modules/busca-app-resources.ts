import { IModuleBuscaAppResource } from '../../domain';
import { BuscaUsuarioAppResource } from './busca-usuario/busca-usuario.app-resource';

export const BuscaAppResources: IModuleBuscaAppResource[] = [
  //
  BuscaUsuarioAppResource,
];

export const getAppResourceByKey = (key: string) => {
  return BuscaAppResources.find((i) => i.key === key) ?? null;
};
