import { numberToBytes } from './bytes';
import { PrimitiveType } from './interfaces';

export type Argument = number | boolean | string | Buffer | Uint8Array;

export function encodeArgument(
  value: Argument,
  typeStr: PrimitiveType
): Buffer {
  switch (typeStr) {
    case PrimitiveType.Number:
      if (typeof value !== 'number') {
        throw new TypeError(typeof value, typeStr);
      }
      return Buffer.from(numberToBytes(value));
    default:
      throw new Error(`Unsupported type ${typeStr}`);
  }
}

export class TypeError extends Error {
  constructor(actual: string, expected: PrimitiveType) {
    super(
      `Found type '${actual}' where type '${expected.toString()}' was expected`
    );
  }
}
