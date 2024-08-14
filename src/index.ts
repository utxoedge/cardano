import { type Context, Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';

import type { Env, TokenData } from './env';

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

export default app;
