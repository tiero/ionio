import { Contract } from '../../src';
import * as ecc from 'tiny-secp256k1';
import { bob, network } from '../fixtures/vars';
import { payments, TxOutput } from 'liquidjs-lib';
import { faucetComplex } from '../utils';

describe('HodlVault', () => {
  let calculator: Contract;
  let prevout: TxOutput;
  let utxo: { txid: string; vout: number; value: number; asset: string };

  beforeAll(async () => {
    // eslint-disable-next-line global-require
    const artifact = require('../fixtures/calculator.json');
    calculator = new Contract(artifact, network, ecc);
    const response = await faucetComplex(calculator.address, 0.0001);

    prevout = response.prevout;
    utxo = response.utxo;
  });

  describe('send', () => {
    it('should succeed when the sum of foo and bar is correct', async () => {
      //const myself = payments.p2wpkh({ pubkey: alice.publicKey }).address!;
      const to = payments.p2wpkh({ pubkey: bob.publicKey }).address!;
      const amount = 9900;
      const feeAmount = 100;

      // lets instantiare the contract using the funding transacton
      const instance = calculator.attach(utxo.txid, utxo.vout, prevout);

      const tx = instance.functions
        .sumMustBeThree(1, 2)
        .withRecipient(to, amount, network.assetHash)
        .withFeeOutput(feeAmount);

      const signedTx = await tx.unlock();
      const hex = signedTx.psbt.extractTransaction().toHex();
      //const txid = await broadcast(hex);
      expect(hex).toBeDefined();
    });
  });
});
