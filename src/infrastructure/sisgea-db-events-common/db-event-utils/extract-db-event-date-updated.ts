import { extractDbEventGenericDataField } from './extract-db-event-generic-data-field';
import { PlaceholderUndefined } from './placeholder-undefined';

export const extractDbEventDataDateUpdated = (data: any) => {
  const rawData = extractDbEventGenericDataField<Date | string | number>('dateUpdated')(data);

  if (rawData !== PlaceholderUndefined) {
    return new Date(rawData);
  }

  return rawData;
};
