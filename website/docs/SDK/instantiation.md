---
title: Contract Instantiation
---

Before interacting with smart contracts on the Elements network, the Ionio SDK needs to instantiate a `Contract` object. This is done by providing the contract's information and constructor arguments. After this instantiation, the Ionio SDK can interact with Elements contracts.


## Contract class
The `Contract` class is used to represent a Ionio contract in a JavaScript object. These objects can be used to retrieve information such as the contract's address and balance. They can be used to interact with the contract by calling the contract's functions.

### Constructor
```ts
new Contract(
  artifact: Artifact,
  network: Network
)
```

A Ionio contract can be instantiated by providing an `Artifact` object and optionally a `Network`.

An `Artifact` object is the result of compiling a Ionio contract with Ionio compiler. Compilation ~~can~~ will be done using the standalone `ionioc` CLI or programmatically with the `ionioc` NPM package.


#### Example
```ts
import { Contract, networks } from '@ionio-lang/ionio';

const artifact = {
  "contractName": "Calculator",
  "functions": [
    {
      "name": "sumMustBeThree",
      "functionInputs": [
        {
          "name": "foo",
          "type": "Number"
        },
        {
          "name": "bar",
          "type": "Number"
        }
      ],
      "require": [],
      "asm": [
        "OP_ADD",
        3,
        "OP_EQUAL"
      ]
    }
  ]
};


const contract = new Contract(artifact, networks.testnet);
```

### address
```ts
contract.address: string
```

A contract's address can be retrieved through the `address` member field.

#### Example
```ts
console.log(contract.address)
```

### bytesize
```ts
contract.bytesize: number
```

The size of the contract's in bytes can be retrieved through the `bytesize` member field. This is useful to ensure that the contract is not too big, since Elements smart contracts can be 520 bytes at most.

#### Example
```ts
console.log(contract.bytesize)
```

### Contract functions
```ts
contract.functions.<functionName>(...args: Argument[]): Transaction
```

The main way to use smart contracts once they have been instantiated is through the functions defined in the Ionio ~~source code~~ artifact. These functions can be found by their name under `functions` member field of a contract object. To call these functions, the parameters need to match ones defined in the Ionio artifact.

These contract functions return an incomplete `Transaction` object, which needs to be completed by providing outputs of the transaction. More information about sending transactions is found on the [*Spending Contracts*](/docs/sdk/transactions) page.

#### Example
```ts
import { Contract, networks } from '@ionio-lang/ionio';
import { artifact, myself, to, amount, utxo, prevout } from './somewhere';

const feeAmount = 100;

const contract = new Contract(artifact, networks.testnet);

// attach to the funded contract using the utxo
const instance = contract.attach(
  utxo.txid, 
  utxo.vout, 
  utxo.prevout
);

const tx = instance.functions
  .sumMustBeThree(1, 2)
  .withRecipient(to, amount, network.assetHash)
  .withRecipient(
    myself, 
    utxo.value - amount - feeAmount, 
    network.assetHash
  )
  .withFeeOutput(feeAmount);


// Finalize the transaction, checking for all requirements to be satisfied. 
// In this case we do not need a signature to unlock the funds
// In case of signature needed, unlock accepts an optional parameter of IdentityProvider interface
const signedTx = await tx.unlock();

// extract and broadcast
const extractedTx = signedTx.psbt.extractTransaction().toHex();
```
