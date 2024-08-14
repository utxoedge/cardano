export type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

type Chain =
  | {
      network: 'mainnet' | 'preprod' | 'preview';
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
  chain: Chain;
};

export type TokenData = Omit<Variables, 'apiKeyId' | 'token'> & { id: string };

export type Env = {
  Bindings: Bindings;
  Variables: Variables;
};
