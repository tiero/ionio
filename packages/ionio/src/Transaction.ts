import {
  address,
  AssetHash,
  confidential,
  Psbt,
  script,
  witnessStackToScriptWitness,
} from 'liquidjs-lib';
import { Network } from 'liquidjs-lib/src/networks';
import { Function, RequirementType } from './Artifact';
import { IdentityProvider, Outpoint, PrimitiveType } from './interfaces';

export interface TransactionInterface {
  psbt: Psbt;
  withUtxo(outpoint: Outpoint): TransactionInterface;
  withRecipient(
    addressOrScript: string | Buffer,
    amount: number,
    assetID: string
  ): TransactionInterface;
  withOpReturn(
    hexChunks: string[],
    value: number,
    assetID: string
  ): TransactionInterface;
  withFeeOutput(fee: number): TransactionInterface;
  unlock(signer?: IdentityProvider): Promise<TransactionInterface>;
}

export class Transaction implements TransactionInterface {
  public psbt: Psbt;

  private fundingUtxoIndex: number = 0;

  constructor(
    private artifactFunction: Function,
    private selector: number,
    private parameters: Buffer[],
    private leaves: { scriptHex: string }[],
    private fundingUtxo: Outpoint | undefined,
    private network: Network
  ) {
    this.psbt = new Psbt({ network: this.network });
    if (this.fundingUtxo) {
      const leafToSpend = this.leaves[this.selector];
      this.psbt.addInput({
        hash: this.fundingUtxo.txid,
        index: this.fundingUtxo.vout,
        witnessUtxo: this.fundingUtxo.prevout,
        tapLeafScript: [
          {
            leafVersion: 0,
            script: Buffer.from(leafToSpend.scriptHex, 'hex'),
            controlBlock: Buffer.alloc(33),
          },
        ],
      });
      this.fundingUtxoIndex = this.psbt.data.inputs.length - 1;
    }
  }

  withUtxo(outpoint: Outpoint): this {
    this.psbt.addInput({
      hash: outpoint.txid,
      index: outpoint.vout,
      witnessUtxo: outpoint.prevout,
    });
    return this;
  }

  withRecipient(
    addressOrScript: string | Buffer,
    value: number,
    assetID: string = this.network.assetHash
  ): this {
    let script = addressOrScript as Buffer;
    if (typeof addressOrScript === 'string') {
      script = address.toOutputScript(addressOrScript);
    }

    this.psbt.addOutput({
      script,
      value: confidential.satoshiToConfidentialValue(value),
      asset: AssetHash.fromHex(assetID, false).bytes,
      nonce: Buffer.alloc(0),
    });

    return this;
  }

  withOpReturn(
    hexChunks: string[],
    value: number = 0,
    assetID: string = this.network.assetHash
  ): this {
    this.psbt.addOutput({
      script: script.compile([
        script.OPS.OP_RETURN,
        ...hexChunks.map(chunk => Buffer.from(chunk, 'hex')),
      ]),
      value: confidential.satoshiToConfidentialValue(value),
      asset: AssetHash.fromHex(assetID, false).bytes,
      nonce: Buffer.alloc(0),
    });
    return this;
  }

  withFeeOutput(value: number): this {
    this.psbt.addOutput({
      script: Buffer.alloc(0),
      value: confidential.satoshiToConfidentialValue(value),
      asset: AssetHash.fromHex(this.network.assetHash, false).bytes,
      nonce: Buffer.alloc(0),
    });
    return this;
  }

  async unlock(signer?: IdentityProvider): Promise<this> {
    let witnessStack: Buffer[] = [];
    this.artifactFunction.require.forEach(async ({ type }) => {
      switch (type) {
        case RequirementType.Signature:
          if (!signer)
            throw new Error(
              'contract requires signature but no IdentityProvider was provided'
            );

          const signedPtxBase64 = await signer.signTransaction(
            this.psbt.toBase64()
          );
          this.psbt = Psbt.fromBase64(signedPtxBase64);

          const { tapScriptSig } = this.psbt.data.inputs[this.fundingUtxoIndex];
          if (tapScriptSig && tapScriptSig.length > 0) {
            witnessStack = [
              ...tapScriptSig.map(s => s.signature),
              ...witnessStack,
            ];
          }
          break;

        case RequirementType.DataSignature:
          if (
            !this.artifactFunction.functionInputs.some(
              p => p.type === PrimitiveType.DataSignature
            )
          )
            throw new Error(
              'contract requires data signature but no DataSignature was provided'
            );
      }
    });

    this.psbt.finalizeInput(this.fundingUtxoIndex!, (_, input) => {
      return {
        finalScriptSig: undefined,
        finalScriptWitness: witnessStackToScriptWitness(
          witnessStack.concat([
            ...this.parameters, // TODO: check if this is correct
            input.tapLeafScript![0].script,
            input.tapLeafScript![0].controlBlock,
          ])
        ),
      };
    });
    return this;
  }
}
