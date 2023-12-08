import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { has } from 'lodash';
import MeiliSearch from 'meilisearch';
import { IModuleBuscaAppResource, IGenericSearchResult } from '../../domain';
import { IGenericListInput } from '../../domain/search/IGenericListInput';
import { ModuleBuscaAppResources, getAppResourceByKey } from '../module-busca-app-resources';
import { parralelMap } from '../helpers/modules.parralel-map';
import { MEILISEARCH_CLIENT } from './tokens/MEILISEARCH_CLIENT';

export const MEILISEARCH_SYNC_RECORDS_INTERVAL = 5 * 1000;

enum RecordDeletionMode {
  DELETE_FROM_SEARCH,
  JUST_UPDATE,
}

const RECORD_DELETION_MODE: RecordDeletionMode = RecordDeletionMode.JUST_UPDATE;

@Injectable()
export class MeilisearchContainerService {
  private isSyncInProgress = false;

  constructor(
    //
    @Inject(MEILISEARCH_CLIENT)
    private meiliSearchClient: MeiliSearch,
  ) {}

  async listResource<T extends { id: K }, K = unknown>(
    indexUid: string,
    dto: IGenericListInput,
    targetIds: K[] | null = null,
  ): Promise<IGenericSearchResult<T>> {
    const { query, limit, offset, sort } = dto;

    const filter: string[] = [
      // ...
      ...(Array.isArray(targetIds) ? [`id IN ${JSON.stringify(targetIds)}`] : []),
      ...(dto.filter ? [dto.filter] : []),
    ];

    const meiliSearchResult = await this.meiliSearchClient.index(indexUid).search<T>(query, {
      limit,
      offset,
      filter,
      sort,
    });

    const result = {
      query: meiliSearchResult.query,

      limit: meiliSearchResult.limit,
      offset: meiliSearchResult.offset,

      total: meiliSearchResult.estimatedTotalHits,

      items: meiliSearchResult.hits,
    };

    return result;
  }

  async dispatchRecordsSync() {
    if (this.isSyncInProgress) {
      return;
    }

    this.isSyncInProgress = true;

    await this.performRecordsSync();

    this.isSyncInProgress = false;
  }

  @Interval(MEILISEARCH_SYNC_RECORDS_INTERVAL)
  async handleSyncRecordsInterval() {
    await this.dispatchRecordsSync();
  }

  async getIndexForResource(resource: string) {
    const appResource = getAppResourceByKey(resource);
    return this.getIndexForAppResource(appResource);
  }

  async getIndexForAppResource(appResource: IModuleBuscaAppResource | null) {
    if (appResource && appResource.search) {
      const resourceIndex = this.meiliSearchClient.index(appResource.search.index);
      return resourceIndex;
    }

    return null;
  }

  async performRecordsDelete(appResource: IModuleBuscaAppResource, records: any[]) {
    const resourceIndex = await this.getIndexForAppResource(appResource);

    if (records.length === 0 || !resourceIndex) {
      return;
    }

    const deletedRecordsIds = records.map((record) => record.id);

    const deleteDocumentsTask = await resourceIndex.deleteDocuments([...deletedRecordsIds]);

    await resourceIndex.waitForTask(deleteDocumentsTask.taskUid);
  }

  async performRecordsUpdate(appResource: IModuleBuscaAppResource, records: any[]) {
    const resourceIndex = await this.getIndexForAppResource(appResource);

    if (!resourceIndex) {
      return;
    }

    const presenter = appResource.presenter();

    const getRecordSearchData = async (record: Record<string, any>) => {
      const searchData = await presenter.getSearchData(record);

      if (searchData === null && has(record, 'id')) {
        return {
          id: record.id,
        };
      }

      return searchData;
    };

    const recordsPresented = await parralelMap(records, getRecordSearchData);

    const updatedRecords = <Record<string, any>[]>recordsPresented.filter((record) => record !== null);

    if (updatedRecords.length > 0) {
      const updateDocumentsTask = await resourceIndex.addDocuments(
        [
          // ...
          ...updatedRecords,
        ],
        { primaryKey: 'id' },
      );

      await resourceIndex.waitForTask(updateDocumentsTask.taskUid);
    }
  }

  private async getRecordsWithOutdatedDateSearchByAppResource(appResource: IModuleBuscaAppResource) {
    if (!appResource.search) {
      return [];
    }

    return [];
  }

  private async findRecordsWithOutdatedDateSearch() {
    const findRecordsWithOutdatedDateSearchGenerator = async function* (this: MeilisearchContainerService) {
      for (const appResource of ModuleBuscaAppResources) {
        let recordsWithOutdatedDateSearch: any[] = [];

        do {
          recordsWithOutdatedDateSearch = await this.getRecordsWithOutdatedDateSearchByAppResource(appResource);

          if (recordsWithOutdatedDateSearch.length > 0) {
            yield {
              appResource,
              records: recordsWithOutdatedDateSearch,
            };
          }
        } while (recordsWithOutdatedDateSearch.length > 0);
      }
    };

    return findRecordsWithOutdatedDateSearchGenerator.call(this);
  }

  private async performRecordsSync() {
    const recordsWithOutdatedDateSearch = await this.findRecordsWithOutdatedDateSearch();

    for await (const outdatedRecord of recordsWithOutdatedDateSearch) {
      const { appResource, records } = outdatedRecord;

      switch (RECORD_DELETION_MODE) {
        case RecordDeletionMode.JUST_UPDATE: {
          await this.performRecordsUpdate(appResource, records);

          break;
        }

        case RecordDeletionMode.DELETE_FROM_SEARCH: {
          const deletedRecords = records.filter((record) => record.dateDeleted !== null);
          await this.performRecordsDelete(appResource, deletedRecords);

          const updatedRecords = records.filter((record) => record.dateDeleted === null);
          await this.performRecordsUpdate(appResource, updatedRecords);

          break;
        }
      }
    }
  }
}
