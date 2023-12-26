import { SisgeaResource } from '@sisgea/spec';
import { IModuleBuscaAppResource, IModuleBuscaAppResourcePresenter } from '../../domain';

export const BuscaAppResourceModalidade: IModuleBuscaAppResource = {
  key: SisgeaResource.MODALIDADE,

  search: {
    index: SisgeaResource.MODALIDADE,
    searchable: [
      'id',
      //
      'slug',
      'nome',
    ],
    filterable: [
      'id',
      //
      'slug',
      'nome',
      //
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
    ],
    sortable: [
      'id',
      //
      'slug',
      'nome',
      //
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

          slug: record.slug,
          nome: record.nome,

          // ...

          dateCreated: record.dateCreated,
          dateUpdated: record.dateUpdated,
          dateDeleted: record.dateDeleted,
        };
      },
    };
  },
};
