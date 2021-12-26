export function numberToHex(value: number, size: number = 4) {
  const bytes = Buffer.alloc(size);
  bytes.writeInt32LE(Number(value), 0);
  const hexValue = bytes.toString('hex')
  return hexValue
}