import { Contract, Signer, Value } from '../../src';
import * as ecc from 'tiny-secp256k1';
import { alicePk, network } from '../fixtures/vars';
import { payments, Psbt, TxOutput } from 'liquidjs-lib';
import { broadcast, faucetComplex, mintComplex } from '../utils';

describe('SyntheticAsset', () => {
  const issuer = payments.p2wpkh({ pubkey: alicePk.publicKey, network })!;
  const borrower = payments.p2wpkh({ pubkey: alicePk.publicKey, network })!;

  let contract: Contract;
  let covenantPrevout: TxOutput;
  let borrowPrevout: TxOutput;
  let covenantUtxo: {
    txid: string;
    vout: number;
    value: number;
    asset: string;
  };
  let borrowUtxo: { txid: string; vout: number; value: number; asset: string };
  const borrowAmount = 500000;
  const payout = 500;

  const signer: Signer = {
    signTransaction: async (base64: string): Promise<string> => {
      const ptx = Psbt.fromBase64(base64);
      ptx.signAllInputs(alicePk);
      return ptx.toBase64();
    },
  };

  beforeAll(async () => {
    // eslint-disable-next-line global-require

    // mint synthetic asset
    // NOTICE: this should happen as atomic swap, now we are simulating it
    // giving the borrower the asset before having him to lock collateral
    try {
      const mintResponse = await mintComplex(
        borrower.address!,
        borrowAmount / 10 ** 8
      );
      borrowUtxo = mintResponse.utxo;
      borrowPrevout = mintResponse.prevout;

      // instantiate Contract
      const artifact = require('../fixtures/synthetic_asset.json');
      contract = new Contract(
        artifact,
        [
          // borrow asset
          borrowUtxo.asset,
          // collateral asset
          network.assetHash,
          // borrow amount
          Value.fromSatoshis(borrowAmount).bytes,
          // payout on redeem amount for issuer
          Value.fromSatoshis(payout).bytes,
          borrower.pubkey!.slice(1),
          issuer.pubkey!.slice(1),
          issuer.output!,
        ],
        network,
        ecc
      );

      // fund our contract
      const faucetResponse = await faucetComplex(contract.address, 0.0001);
      covenantPrevout = faucetResponse.prevout;
      covenantUtxo = faucetResponse.utxo;
    } catch (e) {
      console.error(e);
    }
  });

  describe('redeem', () => {
    it('should redeem with burnt output', async () => {
      const feeAmount = 100;

      // lets instantiare the contract using the funding transacton
      const instance = contract.attach(
        covenantUtxo.txid,
        covenantUtxo.vout,
        covenantPrevout
      );

      const tx = instance.functions
        .redeem(signer)
        // spend an asset
        .withUtxo({
          txid: borrowUtxo.txid,
          vout: borrowUtxo.vout,
          prevout: borrowPrevout,
        })
        // burn asset
        .withOpReturn([], borrowUtxo.value, borrowUtxo.asset)
        // payout to issuer
        .withRecipient(issuer.address!, payout, network.assetHash)
        // collateral
        .withRecipient(
          borrower.address!,
          covenantUtxo.value - payout - feeAmount,
          network.assetHash
        )
        .withFeeOutput(feeAmount);

      const signedTx = await tx.unlock();
      const hex = signedTx.psbt.extractTransaction().toHex();
      console.log(hex);
      const txid = await broadcast(hex);
      expect(txid).toBeDefined();
    });
  });
});
