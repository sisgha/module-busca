import { SisgeaResource } from '@sisgea/spec';
import { IModuleBuscaAppResource, IModuleBuscaAppResourcePresenter } from '../../../domain';

export const BuscaUsuarioAppResource: IModuleBuscaAppResource = {
  key: SisgeaResource.USUARIO,

  search: {
    index: SisgeaResource.USUARIO,
    searchable: [
      'id',
      // ...
      'nome',
      'email',
      'matriculaSiape',
    ],
    filterable: [
      'id',
      // ...
      'nome',
      'email',
      'matriculaSiape',
      // ...
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
    ],
    sortable: [
      'id',
      // ...
      'nome',
      'email',
      'matriculaSiape',
      // ...
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
    ],
  },

  presenter(): IModuleBuscaAppResourcePresenter {
    return {
      getSearchData(record: any): any {
        return {
          id: record.id,
          // ...
          nome: record.nome,
          email: record.email,
          matriculaSiape: record.matriculaSiape,
          // ...
          dateCreated: record.dateCreated,
          dateUpdated: record.dateUpdated,
          dateDeleted: record.dateDeleted,
        };
      },
    };
  },
};
