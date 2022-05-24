import { Contract, numberToBuffer, Signer } from '../../src';
import * as ecc from 'tiny-secp256k1';
import { alicePk, network } from '../fixtures/vars';
import { payments, Psbt, TxOutput } from 'liquidjs-lib';
import { broadcast, faucetComplex, mint } from '../utils';

describe('SyntheticAsset', () => {
  const issuer = payments.p2wpkh({ pubkey: alicePk.publicKey, network })!;
  const borrower = payments.p2wpkh({ pubkey: alicePk.publicKey, network })!;

  let contract: Contract;
  let prevout: TxOutput;
  let utxo: { txid: string; vout: number; value: number; asset: string };

  const signer: Signer = {
    signTransaction: async (base64: string): Promise<string> => {
      const ptx = Psbt.fromBase64(base64);
      ptx.signAllInputs(alicePk);
      return ptx.toBase64();
    },
  };

  beforeAll(async () => {
    // eslint-disable-next-line global-require
    // mint synth
    const { asset } = await mint(borrower.address!, 0.05);

    // instantiate Contract
    const artifact = require('../fixtures/synthetic_asset.json');
    contract = new Contract(
      artifact,
      [
        issuer.pubkey!.slice(1),
        borrower.pubkey!.slice(1),
        // borrow asset
        asset,
        // collateral asset
        network.assetHash,
        // borrow amount
        //amounts are 8 bytes
        numberToBuffer(500000, 8),
        // payout on redeem amount for issuer
        //amounts are 8 bytes
        numberToBuffer(100, 8),
      ],
      network,
      ecc
    );
    const response = await faucetComplex(contract.address, 0.0001);

    prevout = response.prevout;
    utxo = response.utxo;
  });

  describe('redeem', () => {
    it('should redeem with burnt output', async () => {
      const to = payments.p2wpkh({ pubkey: alicePk.publicKey }).address!;
      const amount = 9900;
      const feeAmount = 100;

      // lets instantiare the contract using the funding transacton
      const instance = contract.attach(utxo.txid, utxo.vout, prevout);

      const tx = instance.functions
        .redeem(signer)
        .withRecipient(to, amount, network.assetHash)
        .withFeeOutput(feeAmount);

      const signedTx = await tx.unlock();
      const hex = signedTx.psbt.extractTransaction().toHex();
      console.log(hex);
      const txid = await broadcast(hex);
      expect(txid).toBeDefined();
    });
  });
});
