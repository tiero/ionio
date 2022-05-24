import axios from 'axios';
const APIURL = process.env.APIURL || 'http://localhost:3001';
import {ECPairInterface} from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { tapLeafHash } from 'liquidjs-lib/src/bip341';
import {Psbt, Transaction } from 'liquidjs-lib';
import { Network } from 'liquidjs-lib/src/networks';
import { Signer } from '../src/Signer';

export function sleep(ms: number): Promise<any> {
  return new Promise((res: any): any => setTimeout(res, ms));
}

export async function faucetComplex(address: string, amountFractional: number) {
  const utxo = await faucet(address, amountFractional);
  const txhex = await fetchTx(utxo.txid);
  const prevout = Transaction.fromHex(txhex).outs[utxo.vout];
  return {
    utxo,
    prevout,
  };
}

export async function faucet(address: string, amount: number): Promise<any> {
  try {
    const resp = await axios.post(`${APIURL}/faucet`, { address, amount });
    if (resp.status !== 200) {
      throw new Error('Invalid address');
    }
    const { txId } = resp.data;

    sleep(1000);
    let rr = { data: [] };
    const filter = (): any => rr.data.filter((x: any) => x.txid === txId);
    while (!rr.data.length || !filter().length) {
      sleep(1000);
      rr = await axios.get(`${APIURL}/address/${address}/utxo`);
    }

    return filter()[0];
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function mint(
  address: string,
  quantity: number
): Promise<{ asset: string; txid: string }> {
  try {
    const { status, data } = await axios.post(`${APIURL}/mint`, {
      address,
      quantity,
    });
    if (status !== 200) {
      throw new Error('Invalid address');
    }

    while (true) {
      sleep(1000);
      try {
        const utxos = await fetchUtxos(address, data.txId);
        if (utxos.length > 0) {
          return data;
        }
      } catch (ignore) {}
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}


export async function fetchUtxos(
  address: string,
  txid?: string
): Promise<any[]> {
  try {
    let utxos = (await axios.get(`${APIURL}/address/${address}/utxo`)).data;
    if (utxos && utxos.length > 0 && txid) {
      utxos = utxos.filter((u: any) => u.txid === txid);
    }
    return utxos;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function fetchTx(txId: string): Promise<string> {
  const resp = await axios.get(`${APIURL}/tx/${txId}/hex`);
  return resp.data;
}

export async function fetchUtxo(txId: string): Promise<any> {
  const txHex = await fetchTx(txId);
  const resp = await axios.get(`${APIURL}/tx/${txId}`);
  return { txHex, ...resp.data };
}

export async function broadcast(
  txHex: string,
  verbose = true,
  api: string = APIURL
): Promise<string> {
  try {
    const resp = await axios.post(`${api}/tx`, txHex);
    return resp.data;
  } catch (e) {
    if (verbose) console.error(e);
    throw e;
  }
}


export function getSignerWithECPair(keyPair: ECPairInterface, network: Network): Signer {
  return {
    signTransaction: async (base64: string): Promise<string> => {
      const ptx = Psbt.fromBase64(base64);

      for (let index = 0; index < ptx.data.inputs.length; index++) {
        const input = ptx.data.inputs[index];
        // skip if does not contain the tapLeafScript field
        if (input && !input.tapLeafScript) continue;

        // here we assume to spend the first leaf always in case more than one is provided
        const script = input.tapLeafScript![0].script;
        if (!script) continue;

        const leafHash = tapLeafHash({ scriptHex: script.toString('hex') });
        
        // get the sig hash for each input
        const sighashForSig = ptx.TX.hashForWitnessV1(
          index,
          ptx.data.inputs.map((u) => u.witnessUtxo!.script),
          ptx.data.inputs.map((u) => ({ value: u.witnessUtxo!.value, asset: u.witnessUtxo!.asset })),
          Transaction.SIGHASH_DEFAULT,
          network.genesisBlockHash,
          leafHash,
        );
        
        // sign it
        // notice third parameted MUST have Buffer.alloc(32)
        const sig = Buffer.from(ecc.signSchnorr(sighashForSig, keyPair.privateKey!, Buffer.alloc(32)))

        // attach signature in the taproot field
        ptx.updateInput(index, {
          tapScriptSig: [
            {
              leafHash,
              pubkey: keyPair.publicKey.slice(1),
              signature: sig,
            },
          ],
        });
      }
     
      return ptx.toBase64();
    },
  }
}
