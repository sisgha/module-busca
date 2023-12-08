import * as z from 'zod';
import { UUIDZod } from '../../zod/_literals/uuid.zod';
import { IdIntZod } from '../../zod/_literals/id-int.zod';
import { mapDbEventDataKeys } from '../db-event-utils/map-db-event-data-keys';

export const DbEventZod = z.object({
  id: z.string().uuid(),

  correlationId: UUIDZod.nullable(),
  action: z.string(),
  tableName: z.string(),
  rowId: z.union([UUIDZod, IdIntZod]),
  data: z
    .any()
    .nullable()
    .transform((i) => mapDbEventDataKeys(i)),
  dateEvent: z.string().datetime(),
  logId: UUIDZod,

  dateCreated: z.string().datetime(),
  resource: z.string(),
});
