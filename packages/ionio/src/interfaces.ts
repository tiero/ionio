import { TxOutput } from 'liquidjs-lib';

export enum PrimitiveType {
  Number = 'Number',
  Bytes = 'Bytes',
  Boolean = 'Boolean',
  Signature = 'Signature',
  DataSignature = 'DataSignature',
  PublicKey = 'PublicKey',
  XOnlyPublicKey = 'XOnlyPublicKey',
}

export interface Outpoint {
  txid: string;
  vout: number;
  prevout: TxOutput;
}

export interface IdentityProvider {
  signTransaction(psetBase64: string): Promise<string>;
}
