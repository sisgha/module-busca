import { IModuleBuscaAppResource } from '../../domain';
import { BuscaAppResourceCurso } from './busca-app-resource-curso';
import { BuscaAppResourceModalidade } from './busca-app-resource-modalidade';
import { BuscaUsuarioAppResource } from './busca-usuario/busca-usuario.app-resource';

export const BuscaAppResources: IModuleBuscaAppResource[] = [
  //
  BuscaUsuarioAppResource,
  BuscaAppResourceModalidade,
  BuscaAppResourceCurso,
];

export const getAppResourceByKey = (key: string) => {
  return BuscaAppResources.find((i) => i.key === key) ?? null;
};
