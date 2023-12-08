export interface IModuleBuscaAppResourcePresenter<T = any> {
  getSearchData(record: T): any | null;
}

export type IModuleBuscaAppResourceSearchOptions = {
  index: string;

  searchable: string[];
  filterable: string[];
  sortable: string[];
};

export interface IModuleBuscaAppResource {
  key: string;

  search: IModuleBuscaAppResourceSearchOptions | null;

  presenter(): IModuleBuscaAppResourcePresenter;
}
