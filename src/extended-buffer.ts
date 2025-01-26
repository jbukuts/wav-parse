import { Buffer as OriginalBuffer } from 'buffer/index';

interface IExtendedBuffer extends OriginalBuffer {
  readString(o: number, l: number): string;
  readALaw(o: number): number;
}

function createExtendedBuffer(data: ArrayBuffer | OriginalBuffer) {
  const buf = OriginalBuffer.from(data) as IExtendedBuffer;

  buf.readString = function readString(offset: number, length: number) {
    return this.toString('ascii', offset, offset + length);
  };

  buf.readALaw = function readALaw(offset: number) {
    const v = this.readInt8(offset);
    const str = (v >>> 0).toString(2).slice(-8).padStart(8, '0');
    const sign = parseInt(str.slice(0, 1), 2) === 0 ? 1 : 0;
    const exp = parseInt(str.slice(1, 4), 2);
    const mantissa = parseInt(str.slice(4), 2);

    return (
      (-1) ** sign *
      (16 * Math.min(1, exp) + mantissa + 0.5) *
      2 ** Math.max(1, exp)
    );
  };

  return buf;
}

export { createExtendedBuffer as ExtendedBuffer };
