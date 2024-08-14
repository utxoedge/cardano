import type { Bindings, CardanoNetwork } from './env';

export class Cardano {
  #kv: KVNamespace;

  constructor(network: CardanoNetwork, env: Bindings) {
    if (network === 'mainnet') {
      this.#kv = env.CARDANO_V1_MAINNET;
    } else if (network === 'preprod') {
      this.#kv = env.CARDANO_V1_PREPROD;
    } else {
      this.#kv = env.CARDANO_V1_PREVIEW;
    }
  }

  get kv() {
    return this.#kv;
  }
}
