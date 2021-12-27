import { FinalOperation } from "./intermediate";

export function cast(operations: FinalOperation[]) {
  operations.forEach((finalOp: FinalOperation, index: number) => {
    const previousIndex = index - 1;
    // checks for casting of bytes(Integer) at main level
    if (finalOp.type === "instructionOp" && finalOp.expression.instruction === "bytes") {
      const previousOp = operations[previousIndex];
      if (previousOp.type === "push" && previousOp.literalType === "Integer") {
        operations[previousIndex] = {
          ...previousOp,
          literalType: "Bytes",
          value: numberToHex(Number(previousOp.value))
        };
      }
    }
  });
  return operations;
}

export function numberToHex(value: number, size: number = 4) {
  const bytes = Buffer.alloc(size);
  bytes.writeInt32LE(Number(value), 0);
  const hexValue = '0x' + bytes.toString('hex')
  return hexValue
}