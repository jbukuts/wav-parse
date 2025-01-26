import parseHead from './parse-header';
import readFile from './read-file';

declare module 'buffer' {
  interface Buffer {
    readString: (offset: number, byteLength: number) => string;
    readALaw: (offset: number) => number;
    readMuLaw: (offset: number) => number;
  }
}

Buffer.prototype.readString = function (
  this: Buffer,
  offset: number,
  length: number
) {
  return this.toString('ascii', offset, offset + length);
};

Buffer.prototype.readALaw = function (this: Buffer, offset: number) {
  const v = this.readInt8(offset);

  const str = (v >>> 0).toString(2).slice(-8).padStart(8, '0');
  // console.log(str, v);
  const sign = parseInt(str.slice(0, 1), 2) === 0 ? 1 : 0;
  const exp = parseInt(str.slice(1, 4), 2);
  const mantissa = parseInt(str.slice(4), 2);

  return (
    (-1) ** sign *
    (16 * Math.min(1, exp) + mantissa + 0.5) *
    2 ** Math.max(1, exp)
  );
};

export { parseHead, readFile };
