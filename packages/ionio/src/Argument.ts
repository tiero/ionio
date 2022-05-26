import { script } from 'liquidjs-lib';
import { PrimitiveType } from './Artifact';
import { isSigner, Signer } from './Signer';

export type Argument = number | boolean | string | Buffer | Signer;

export function encodeArgument(
  value: Argument,
  typeStr: PrimitiveType
): Buffer | Signer {
  switch (typeStr) {
    case PrimitiveType.Bytes:
      if (!Buffer.isBuffer(value)) {
        throw new TypeError(typeof value, typeStr);
      }
      return value;

    case PrimitiveType.Number:
      if (typeof value !== 'number') {
        throw new TypeError(typeof value, typeStr);
      }
      return script.number.encode(value);

    case PrimitiveType.XOnlyPublicKey:
      if (!Buffer.isBuffer(value)) {
        throw new TypeError(typeof value, typeStr);
      }
      if (value.length !== 32) {
        throw new Error('Invalid x-ony public key length');
      }
      return value;

    case PrimitiveType.PublicKey:
      if (!Buffer.isBuffer(value)) {
        throw new TypeError(typeof value, typeStr);
      }
      if (value.length !== 33) {
        throw new Error('Invalid public key length');
      }
      return value;

    case PrimitiveType.Boolean:
      if (typeof value !== 'boolean') {
        throw new TypeError(typeof value, typeStr);
      }
      return script.number.encode(value ? 1 : 0);

    case PrimitiveType.Asset:
      if (typeof value !== 'string') {
        throw new TypeError(typeof value, typeStr);
      }
      const assetID = Buffer.from(value, 'hex');
      const reversedAssetBuffer = assetID.reverse() as Buffer;
      return reversedAssetBuffer;

    case PrimitiveType.Signature:
      if (!isSigner(value)) {
        throw new TypeError(typeof value, typeStr);
      }
      return value;

    case PrimitiveType.DataSignature:
      if (!Buffer.isBuffer(value)) {
        throw new TypeError(typeof value, typeStr);
      }
      return value;

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
