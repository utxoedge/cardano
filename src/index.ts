import { Hono } from 'hono';

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
  return c.text('UTXO Edge - Cardano');
});

export default app;
