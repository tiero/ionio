import { numberToBytes } from './bytes';

export type Argument = number | boolean | string | Uint8Array;

export function encodeArgument(value: Argument, typeStr: string): Uint8Array {
  console.log(`Encoding argument ${value} of type ${typeStr}`);

  switch (typeStr) {
    case 'Number':
      if (typeof value !== 'number') {
        throw new TypeError(typeof value, typeStr);
      }
      return numberToBytes(value);
    default:
      throw new Error(`Unsupported type ${typeStr}`);
  }
}

export class TypeError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `Found type '${actual}' where type '${expected.toString()}' was expected`
    );
  }
}
