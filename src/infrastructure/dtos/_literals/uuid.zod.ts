import * as z from 'zod';

const msg = 'Deve ser um uuid válido.';

export const UUIDZod = z.string().uuid(msg);
