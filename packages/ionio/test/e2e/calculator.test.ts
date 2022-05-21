import { Contract} from '../../src';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';
import {
  bob,
  network
} from '../fixtures/vars';
import { payments, Transaction, TxOutput } from 'liquidjs-lib';

const APIURL = process.env.APIURL || 'http://localhost:3001';

describe('HodlVault', () => {
  let calculator: Contract;
  let prevout: TxOutput;
  let utxo: {txid: string, vout: number};

  beforeAll(async () => {
    // eslint-disable-next-line global-require
    const artifact = require('../fixtures/calculator.json');
    calculator = new Contract(artifact, network, ecc);

    // fund with 1000 sats
    await axios.post(
      `${APIURL}/faucet`, 
      { 
        address: calculator.address, 
        amount: 10000 
      });
    await sleep(1000);

    // get utxo
    const { data: utxos } = await axios.get(`${APIURL}/address/${calculator.address}/utxo`);
    [utxo] = utxos;
    // fund with 1000 sats
    const { data: txHex} = await axios.get(`${APIURL}/tx/${utxo.txid}/hex`);
    prevout = Transaction.fromHex(txHex).outs[utxo.vout];
  });

  describe('send', () => {
    it('should succeed when the sum of foo and bar is correct', async () => {

      const to = payments.p2wpkh({ pubkey: bob.publicKey }).address!;
      const amount = 9900;
      const feeAmount = 100;
      console.log(to, amount);

      // lets instantiare the contract using the funding transacton
      const instance = calculator.at(utxo.txid, utxo.vout, prevout);

      const tx = instance.functions
        .sumMustBeThree(1, 2)
        .withRecipient(to, amount, network.assetHash)
        .withFeeOutput(feeAmount);

      console.log(tx.psbt.TX.toHex, tx.parameters);  
    });
  });
});

function sleep(ms: number): Promise<any> {
  return new Promise((res: any): any => setTimeout(res, ms));
}
