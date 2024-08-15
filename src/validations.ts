import { z } from 'zod';

export const utxosByAddressQuerySchema = z.object({
  page: z.string().nullish(),
});

export const utxosByAssetQuerySchema = z.object({
  page: z.string().nullish(),
});

export const utxosByAddressAssetQuerySchema = z.object({
  page: z.string().nullish(),
});
