import { SisgeaResource } from '@sisgea/spec';
import { IModuleBuscaAppResource, IModuleBuscaAppResourcePresenter } from '../../domain';

export const BuscaAppResourceCurso: IModuleBuscaAppResource = {
  key: SisgeaResource.CURSO,

  search: {
    index: SisgeaResource.CURSO,
    searchable: [
      'id',
      //
      'nome',
      'nomeAbreviado',
    ],
    filterable: [
      'id',
      //
      'nome',
      'nomeAbreviado',
      'modalidade.id',
      //
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
    ],
    sortable: [
      'id',
      //
      'nome',
      'nomeAbreviado',
      'modalidade.id',
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

          nome: record.nome,
          nomeAbreviado: record.nomeAbreviado,

          modalidade: record.modalidade
            ? {
                id: record.modalidade.id,
              }
            : null,

          // ...

          dateCreated: record.dateCreated,
          dateUpdated: record.dateUpdated,
          dateDeleted: record.dateDeleted,
        };
      },
    };
  },
};
