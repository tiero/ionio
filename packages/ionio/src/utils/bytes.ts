// From https://github.com/bit-matrix/wiz-data/blob/master/src/lib/number.ts

const BIT_8 = 8;

const log = (base: number, x: number): number => Math.log(x) / Math.log(base);

const numberByteLength = (x: number): number => {
  if (x === 0) return 0;
  else if (0 < x) return Math.ceil((log(2, x + 1) + 1) / 8);
  else if (x < 0) return Math.floor((log(2, -x) + 1) / 8 + 1);
  return 0;
};

const resizeBytes = (
  uint8Array: Uint8Array,
  byteLength: number
): Uint8Array => {
  const resizedUint8Array: Uint8Array = new Uint8Array(byteLength);
  if (uint8Array.length > byteLength) {
    const maxNumber: number = Math.pow(2, BIT_8) - 1;
    resizedUint8Array.fill(maxNumber);
  } else {
    resizedUint8Array.set(uint8Array);
  }
  return resizedUint8Array;
};

const numeralNextValue = (
  value: number,
  base: number
): { numeral: number; nextValue: number } => {
  const numeral: number = value % base;
  const nextValue: number = (value - numeral) / base;
  return { numeral, nextValue };
};

const uint8NumberToBytes = (value: number): Uint8Array => {
  const baseNumber: number = Math.pow(2, BIT_8);
  let lastValue: number = value;
  const numeralArray: number[] = [];

  while (lastValue >= baseNumber) {
    const { numeral, nextValue } = numeralNextValue(lastValue, baseNumber);
    numeralArray.push(numeral);
    lastValue = nextValue;
  }

  if (lastValue > 0) numeralArray.push(lastValue);
  const result: Uint8Array = Uint8Array.from(numeralArray);
  return result;
};

const numberToBytes = (value: number): Uint8Array => {
  const byteLength: number = numberByteLength(value);
  const inputNumber: number =
    value < 0 ? Math.pow(2, 8 * byteLength - 1) - value : value;
  const uint8NumberBytes: Uint8Array = uint8NumberToBytes(inputNumber);
  return resizeBytes(uint8NumberBytes, byteLength);
};

export const numberToBuffer = (value: number, size: number = 8): Buffer => {
  const valueBytes = Buffer.from(numberToBytes(value));
  const valueLE = Buffer.from([
    ...valueBytes,
    ...Buffer.alloc(Math.max(size - valueBytes.length, 0)),
  ]);
  return valueLE;
};
