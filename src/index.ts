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

      c.set('apiKeyId', id);
      c.set('chain', chain);
      c.set('workspaceId', workspaceId);
      c.set('token', token);

      return true;
    },
  }),
);

app.get('/', (c) => {
  return c.text('UTXO Edge - Cardano');
});

export default app;
