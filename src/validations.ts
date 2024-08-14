import { z } from 'zod';

export const utxosByAddressQuerySchema = z.object({
  page: z.string().nullish(),
});
