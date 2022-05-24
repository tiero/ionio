import { TxOutput } from 'liquidjs-lib';

export interface Outpoint {
  txid: string;
  vout: number;
  prevout: TxOutput;
}
