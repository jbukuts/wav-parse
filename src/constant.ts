import { ReadFunction } from './types';

export type ValueType = 'uint' | 'int' | 'float' | 'string';
type ReaderMap = Record<number, ReadFunction>;
type ByteReader = Record<ValueType, ReaderMap>;

export const BYTE_READERS: ByteReader = {
  string: new Proxy<ReaderMap>({}, { get: () => 'readString' }),
  uint: new Proxy<ReaderMap>({}, { get: () => 'readUIntLE' }),
  int: new Proxy<ReaderMap>({}, { get: () => 'readIntLE' }),
  float: {
    4: 'readFloatLE',
    8: 'readDoubleLE'
  }
};
