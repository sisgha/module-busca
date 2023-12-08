import { DbEventModel } from '../../../domain';
import { DbEventZod } from '../../dtos';
import { tryJSONParse } from '../../helpers/try-json-parse.util';
import { HandleDbEventOutputReason } from '../domain/HandleDbEventOutputReason';

export const parseDbEvent = async (dbEventRaw: unknown) => {
  const dbEvent = typeof dbEventRaw === 'string' ? tryJSONParse(dbEventRaw) : dbEventRaw;

  const dbEventValidationResult = await DbEventZod.safeParseAsync(dbEvent);

  if (dbEventValidationResult.success) {
    const dbEvent = dbEventValidationResult.data as DbEventModel;

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
