import { Transaction } from './Transaction';
import { Argument, encodeArgument } from './Argument';
import { Artifact, Function } from './Artifact';
import { Network } from 'liquidjs-lib/src/networks';
import {
  toHashTree,
  BIP341Factory,
  TinySecp256k1Interface,
} from 'liquidjs-lib/src/bip341';
import { address, script } from 'liquidjs-lib';
import { H_POINT } from './constants';

export class Contract {
  name: string;
  address: string;
  // TODO add bytesize calculation
  //bytesize: number;

  functions: {
    [name: string]: ContractFunction;
  };

  leaves: { scriptHex: string }[];

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

    // Populate the functions object with the contract's functions
    // (with a special case for single function, which has no "function selector")
    this.functions = {};
    this.leaves = [];
    if (artifact.functions.length === 1) {
      const f = artifact.functions[0];
      this.functions[f.name] = this.createFunction(f);
      // add script hex to leaves
      this.leaves.push({
        scriptHex: script.fromASM(f.asm.join(' ')).toString('hex'),
      });
    } else {
      artifact.functions.forEach((f, i) => {
        this.functions[f.name] = this.createFunction(f, i);
        this.leaves.push({
          scriptHex: script.fromASM(f.asm.join(' ')).toString('hex'),
        });
      });
    }

    this.name = artifact.contractName;
    const bip341 = BIP341Factory(this.ecclib);
    const hashTree = toHashTree(this.leaves);
    const scriptPubKey = bip341.taprootOutputScript(H_POINT, hashTree);
    this.address = address.fromOutputScript(scriptPubKey, this.network);
    // TODO add bytesize calculation
    //this.bytesize = calculateBytesize(this.leaves);
  }

  private createFunction(
    artifactFunction: Function,
    selector?: number
  ): ContractFunction {
    return (...args: Argument[]) => {
      if (artifactFunction.parameters.length !== args.length) {
        throw new Error(
          `Incorrect number of arguments passed to function ${artifactFunction.name}`
        );
      }

      // Encode passed args (this also performs type checking)
      const encodedArgs = args.map((arg, i) =>
        encodeArgument(arg, artifactFunction.parameters[i].type)
      );

      console.log(encodedArgs);

      return new Transaction();
      /*     this.address,
        artifactFunction,
        encodedArgs,
        selector,
        this.network */
    };
  }
}

export type ContractFunction = (...args: Argument[]) => Transaction;
