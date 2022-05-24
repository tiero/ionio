import { Transaction } from './Transaction';
import { Argument, encodeArgument } from './Argument';
import { Artifact, Function } from './Artifact';
import { Network } from 'liquidjs-lib/src/networks';
import {
  toHashTree,
  BIP341Factory,
  HashTree,
  TinySecp256k1Interface,
  TaprootLeaf,
} from 'liquidjs-lib/src/bip341';
import { address, script, TxOutput } from 'liquidjs-lib';
import { H_POINT } from './constants';
import { Outpoint } from './interfaces';
import { tweakPublicKey } from './utils/taproot';
import { templateToAsm } from './utils/asm';

export interface ContractInterface {
  name: string;
  address: string;
  fundingOutpoint: Outpoint | undefined;
  bytesize: number;
  functions: {
    [name: string]: ContractFunction;
  };
  leaves: { scriptHex: string }[];
  scriptPubKey: Buffer;
  attach(txid: string, vout: number, prevout: TxOutput): ContractInterface;
  getTaprootTree(): HashTree;
}

export class Contract implements ContractInterface {
  name: string;
  address: string;
  fundingOutpoint: Outpoint | undefined;
  // TODO add bytesize calculation
  bytesize: number = 0;

  functions: {
    [name: string]: ContractFunction;
  };

  leaves: TaprootLeaf[];
  scriptPubKey: Buffer;
  private parity: number;

  constructor(
    private artifact: Artifact,
    constructorArgs: Argument[],
    private network: Network,
    private ecclib: TinySecp256k1Interface
  ) {
    const expectedProperties = [
      'contractName',
      'functions',
      'constructorInputs'
    ];
    if (!expectedProperties.every(property => property in artifact)) {
      throw new Error('Invalid or incomplete artifact provided');
    }

    if (artifact.constructorInputs.length !== constructorArgs.length) {
      throw new Error(
        `Incorrect number of arguments passed to ${artifact.contractName} constructor`
      );
    }

    // Encode arguments (this also performs type checking)
    const encodedArgs = constructorArgs
      .map((arg, i) => encodeArgument(arg, artifact.constructorInputs[i].type))
      .reverse();

    this.leaves = [];
    this.functions = {};
    // Populate the functions object with the contract's functions
    // (with a special case for single function, which has no "function selector")
    this.artifact.functions.forEach((f, i) => {
      const expectedProperties = ['name', 'functionInputs', 'require', 'asm'];
      if (!expectedProperties.every(property => property in f)) {
        throw new Error(
          `Invalid or incomplete function provided at index ${i}`
        );
      }
      this.functions[f.name] = this.createFunction(f, i);

      // check for constructor inputs to replace template strings starting with $
      const asm = templateToAsm(
        f.asm,
        this.artifact.constructorInputs,
        encodedArgs
      );

      this.leaves.push({
        scriptHex: script.fromASM(asm.join(' ')).toString('hex'),
      });
    });

    // name
    this.name = artifact.contractName;

    const bip341 = BIP341Factory(this.ecclib);
    const hashTree = toHashTree(this.leaves);

    // scriptPubKey & addressl
    this.scriptPubKey = bip341.taprootOutputScript(H_POINT, hashTree);
    this.address = address.fromOutputScript(this.scriptPubKey, this.network);

    // parity bit
    const { parity } = tweakPublicKey(H_POINT, hashTree.hash, this.ecclib);
    this.parity = parity;
    // TODO add bytesize calculation
    //this.bytesize = calculateBytesize(this.leaves);
  }

  getTaprootTree(): HashTree {
    return toHashTree(this.leaves, true);
  }

  attach(txid: string, vout: number, prevout: TxOutput): this {
    // check we are using an actual funding outpoint for the script of the contract
    if (!prevout.script.equals(this.scriptPubKey))
      throw new Error(
        'given prevout script does not match contract scriptPubKey'
      );

    this.fundingOutpoint = {
      txid,
      vout,
      prevout,
    };

    return this;
  }

  private createFunction(
    artifactFunction: Function,
    selector: number
  ): ContractFunction {
    return (...args: Argument[]) => {
      if (artifactFunction.functionInputs.length !== args.length) {
        throw new Error(
          `Incorrect number of arguments passed to function ${artifactFunction.name}`
        );
      }

      // Encode passed args (this also performs type checking)
      const encodedArgs = args.map((arg, i) =>
        encodeArgument(arg, artifactFunction.functionInputs[i].type)
      );

      return new Transaction(
        artifactFunction,
        selector,
        encodedArgs,
        this.leaves,
        this.parity,
        this.fundingOutpoint,
        this.network
      );
    };
  }
}

export type ContractFunction = (...args: Argument[]) => Transaction;
