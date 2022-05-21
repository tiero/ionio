import { address, AssetHash, confidential, Psbt, script } from 'liquidjs-lib';
import { Network } from 'liquidjs-lib/src/networks';
import { Function } from './Artifact';
import { Outpoint } from './interfaces';


export class Transaction {
  public psbt: Psbt;
  public parameters: Buffer[];
  
  constructor(
    private artifactFunction: Function,
    private selector: number,
    private args: Buffer[],
    private leaves: { scriptHex: string }[],
    private fundingOutpoint: Outpoint | undefined,
    private network: Network,
  ) {   
    this.psbt = new Psbt({ network: this.network });
    this.parameters = args;
    if (this.fundingOutpoint) {
      this.psbt.addInput({
        hash: this.fundingOutpoint.txid, 
        index: this.fundingOutpoint.vout, 
        witnessUtxo: this.fundingOutpoint.prevout,
      });
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

  withRecipient(addressOrScript: string | Buffer, value: number, assetID: string): this {
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

  withOpReturn(hexChunks: string[], value: number = 0, assetID: string = this.network.assetHash): this {
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

  build() {
    console.log(this.artifactFunction, this.selector, this.args, this.leaves)
  }
}
