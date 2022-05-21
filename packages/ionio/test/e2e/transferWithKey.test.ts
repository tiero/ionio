import { Contract } from '../../src';
import * as ecc from 'tiny-secp256k1';
import { alicePk, network } from '../fixtures/vars';
import { payments, Psbt, TxOutput } from 'liquidjs-lib';
import { broadcast, faucetComplex } from '../utils';
import { IdentityProvider } from '../../src/interfaces';

describe('TransferWithKey', () => {
  let contract: Contract;
  let prevout: TxOutput;
  let utxo: { txid: string; vout: number; value: number; asset: string };

  const signer: IdentityProvider = {
    signTransaction: async (base64: string): Promise<string> => {
      const ptx = Psbt.fromBase64(base64);
      await ptx.signInputAsync(0, alicePk);
      return ptx.toBase64();
    },
  };

  beforeAll(async () => {
    // eslint-disable-next-line global-require
    const artifact = require('../fixtures/transfer_with_key.json');
    contract = new Contract(artifact, network, ecc);
    const response = await faucetComplex(contract.address, 0.0001);

    prevout = response.prevout;
    utxo = response.utxo;
  });

  describe('transfer', () => {
    it('should transfer with signature', async () => {
      const to = payments.p2wpkh({ pubkey: alicePk.publicKey }).address!;
      const amount = 9900;
      const feeAmount = 100;

      // lets instantiare the contract using the funding transacton
      const instance = contract.attach(utxo.txid, utxo.vout, prevout);

      const tx = instance.functions
        .transfer()
        .withRecipient(to, amount, network.assetHash)
        .withFeeOutput(feeAmount);

      const signedTx = await tx.unlock(signer);
      const hex = signedTx.psbt.extractTransaction().toHex();
      const txid = await broadcast(hex);
      expect(txid).toBeDefined();
    });
  });
});
