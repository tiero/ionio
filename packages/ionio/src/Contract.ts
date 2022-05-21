import { Transaction } from './Transaction';
import { Argument, encodeArgument } from './Argument';
import { Artifact, Function } from './Artifact';
import { Network } from 'liquidjs-lib/src/networks';
import {
  toHashTree,
  BIP341Factory,
  HashTree,
  TinySecp256k1Interface,
} from 'liquidjs-lib/src/bip341';
import { address, script, TxOutput } from 'liquidjs-lib';
import { H_POINT } from './constants';
import { Outpoint } from './interfaces';

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

  leaves: { scriptHex: string }[];
  scriptPubKey: Buffer;

  constructor(
    private artifact: Artifact,
    private network: Network,
    private ecclib: TinySecp256k1Interface
  ) {
    //TODO add constructorInputs if we figure out templating strings
    const expectedProperties = ['contractName', 'functions'];
    if (!expectedProperties.every(property => property in artifact)) {
      throw new Error('Invalid or incomplete artifact provided');
    }

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

      // check for constructor inputs
      const asm = f.asm.map(op => {
        // if Number encode as bytes
        if (typeof op === 'number' && Number.isInteger(op)) {
          return script.number.encode(op).toString('hex');
        }
        return op;
      });

      this.leaves.push({
        scriptHex: script.fromASM(asm.join(' ')).toString('hex'),
      });
    });

    // name
    this.name = artifact.contractName;

    // address
    const bip341 = BIP341Factory(this.ecclib);
    const hashTree = toHashTree(this.leaves);
    this.scriptPubKey = bip341.taprootOutputScript(H_POINT, hashTree);
    this.address = address.fromOutputScript(this.scriptPubKey, this.network);
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
        this.fundingOutpoint,
        this.network
      );
    };
  }
}

export type ContractFunction = (...args: Argument[]) => Transaction;
