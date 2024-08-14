export type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

export type CardanoNetwork = 'mainnet' | 'preprod' | 'preview';

type Chain =
  | {
      network: CardanoNetwork;
      name: 'cardano';
    }
  | {
      network: 'mainnet' | 'testnet';
      name: 'bitcoin';
    };

export type Variables = {
  apiKeyId: string;
  workspaceId: string;
  token: string;
  network: CardanoNetwork;
};

export type TokenData = { id: string; chain: Chain; workspaceId: string };

export type Env = {
  Bindings: Bindings;
  Variables: Variables;
};
