import inclusion from 'inclusion';
import type pMap from 'p-map';

// START p-map module
type IPMap = typeof pMap;
export const getPMap = (): Promise<IPMap> => inclusion('p-map').then((mod) => mod.default);
// END p-map module

export const parralelMap = async <T, R>(items: T[], mapper: (item: T) => Promise<R>, concurrency = 10): Promise<R[]> => {
  const pMap = await getPMap();
  return pMap(items, mapper, { concurrency });
};
