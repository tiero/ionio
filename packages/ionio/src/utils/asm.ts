import { Parameter } from '../Artifact';
import { Signer } from '../Signer';

export function templateToAsm(
  template: string[],
  constructorInputs: Parameter[],
  encodeArguments: (Buffer | Signer)[]
): string[] {
  if (encodeArguments.length !== constructorInputs.length) {
    throw new Error(
      'Invalid number of encodeArguments for the given constructorInputs'
    );
  }

  return template.map((op: string) => {
    // it's a template string?
    if (op.startsWith('$')) {
      const withoutDollar = op.slice(1);
      // it's a template string among parameters?
      const position = constructorInputs.findIndex(
        p => p.name === withoutDollar
      );
      if (position === -1) {
        throw new Error(`${withoutDollar} not found in constructorInputs`);
      }

      return encodeArguments[position].toString('hex');
    }

    // it's a hexadecimal string?
    if (op.startsWith('0x')) {
      return op.slice(2);
    }

    return op;
  });
}
