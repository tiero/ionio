import { TxOutput } from "liquidjs-lib"

export enum PrimitiveType {
  Number = 'Number',
  Bytes = 'Bytes',
  Boolean = 'Boolean',
  Signature = 'Signature',
  DataSignature = 'DataSignature',
  XOnlyPublicKey = 'XOnlyPublicKey',
}

export interface Outpoint {
  txid: string,
  vout: number,
  prevout: TxOutput
}