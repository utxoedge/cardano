import { type Context, Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { zValidator } from '@hono/zod-validator';

import type { Env, TokenData } from './env';
import { Cardano } from './cardano';
import { utxosByAddressQuerySchema } from './validations';

const app = new Hono<Env>();

app.use(
  bearerAuth({
    verifyToken: async (token, c: Context<Env>) => {
      const data = await c.env.TOKENS.get(token);

      if (!data) {
        return false;
      }

      const { id, workspaceId, chain }: TokenData = JSON.parse(data);

      if (chain.name !== 'cardano') {
        return false;
      }

      c.set('apiKeyId', id);
      c.set('network', chain.network);
      c.set('workspaceId', workspaceId);
      c.set('token', token);
      c.set('cardano', new Cardano(chain.network, c.env));

      return true;
    },
  }),
);

app.get('/', (c) => {
  return c.json({ message: 'UTXO Edge - Cardano' });
});

app.get('/info', (c) => {
  return c.json({
    id: c.var.apiKeyId,
    workspaceId: c.var.workspaceId,
    chain: {
      name: 'cardano',
      network: c.var.network,
    },
  });
});

app.get(
  '/addresses/:address/utxos',
  zValidator('query', utxosByAddressQuerySchema),
  async (c) => {
    const address = c.req.param('address');
    const page = c.req.valid('query').page ?? '1';

    const utxos = await c.var.cardano.kv.get(`${address}#${page}`);

    const responseBody = `{"utxos":${utxos || '[]'}}`;

    c.header('Content-Type', 'application/json');

    return c.body(responseBody);
  },
);

app.get('/slot', async (c) => {
  const slot = await c.var.cardano.kv.get('slot');

  const responseBody = `{"slot":${slot}}`;

  c.header('Content-Type', 'application/json');

  return c.body(responseBody);
});

app.get('/protocol-params', async (c) => {
  const protocolParams = await c.var.cardano.kv.get('protocol-params');

  const responseBody = `{"protocolParams":${protocolParams}}`;

  c.header('Content-Type', 'application/json');

  return c.body(responseBody);
});

export default app;
