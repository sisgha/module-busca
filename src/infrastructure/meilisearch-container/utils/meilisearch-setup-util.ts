import { isEqual } from 'lodash';
import { MeiliSearch } from 'meilisearch';
import { IModuleBuscaAppResource } from '../../../domain';
import { BuscaAppResources } from '../../../application/modules/busca-app-resources';

export class MeilisearchSetupUtil {
  static async ensureIndexExists(client: MeiliSearch, index: string): Promise<void> {
    console.info(`[INFO] MeiliSearchClient: ${index} -> ensuring that it exists...`);

    await client.getIndex(index).catch((err) => {
      if (err.code === 'index_not_found') {
        console.info(`[INFO] MeiliSearchClient: ${index} -> creating index...`);

        return client.createIndex(index, { primaryKey: 'id' }).then((task) => client.waitForTask(task.taskUid));
      }
    });

    console.info('[INFO] done');
  }

  static async ensureSearchable<T extends string>(client: MeiliSearch, index: string, searchable: T[]) {
    const currentSearchable = await client.index(index).getSearchableAttributes();

    if (!isEqual(currentSearchable, searchable)) {
      console.info(`[INFO] MeiliSearchClient: ${index} -> updateSearchableAttributes(${searchable})`);

      await client
        .index(index)
        .updateSearchableAttributes(searchable)
        .then((task) => client.waitForTask(task.taskUid));

      console.info('[INFO] done');
    }
  }

  static async ensureFilterable<T extends string>(client: MeiliSearch, index: string, filterable: T[]) {
    const currentFilterable = await client.index(index).getFilterableAttributes();

    if (!isEqual(currentFilterable, filterable)) {
      console.info(`[INFO] MeiliSearchClient: ${index} -> updateFilterableAttributes(${filterable})`);

      await client
        .index(index)
        .updateFilterableAttributes(filterable)
        .then((task) => client.waitForTask(task.taskUid));

      console.info('[INFO] done');
    }
  }

  static async ensureSortable<T extends string>(client: MeiliSearch, index: string, sortable: T[]) {
    const currentSortable = await client.index(index).getSortableAttributes();

    if (!isEqual(currentSortable, sortable)) {
      console.info(`[INFO] MeiliSearchClient: ${index} -> updateSortableAttributes(${sortable})`);

      await client
        .index(index)
        .updateSortableAttributes(sortable)
        .then((task) => client.waitForTask(task.taskUid));

      console.info('[INFO] done');
    }
  }

  static async setupIndex(client: MeiliSearch, appResource: IModuleBuscaAppResource) {
    const appResourceSearchOptions = appResource.search;

    if (appResourceSearchOptions) {
      const { filterable, index, searchable, sortable } = appResourceSearchOptions;

      await MeilisearchSetupUtil.ensureIndexExists(client, index);
      await MeilisearchSetupUtil.ensureSearchable(client, index, <any>searchable);
      await MeilisearchSetupUtil.ensureFilterable(client, index, <any>filterable);
      await MeilisearchSetupUtil.ensureSortable(client, index, <any>sortable);
    }
  }

  static async setupInstance(client: MeiliSearch) {
    for (const appResource of BuscaAppResources) {
      await MeilisearchSetupUtil.setupIndex(client, appResource);
    }
  }
}
