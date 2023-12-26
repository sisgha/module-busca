import { SisgeaDbEventModel } from '@sisgea/spec';
import { tryJSONParse } from '../../helpers/utils/try-json-parse.util';
import { HandleDbEventOutputReason } from '../domain/HandleDbEventOutputReason';
import { DbEventZod } from '../index';

export const parseDbEvent = async (dbEventRaw: unknown) => {
  const dbEvent = typeof dbEventRaw === 'string' ? tryJSONParse(dbEventRaw) : dbEventRaw;

  const dbEventValidationResult = await DbEventZod.safeParseAsync(dbEvent);

  if (dbEventValidationResult.success) {
    const dbEvent = dbEventValidationResult.data as SisgeaDbEventModel;

    return {
      success: true,
      reason: null,
      data: dbEvent,
    } as const;
  }

  return {
    success: false,
    data: null,
    reason: HandleDbEventOutputReason.INVALID_DB_EVENT,
  } as const;
};
