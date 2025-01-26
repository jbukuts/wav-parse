import { FORMAT_CODE, FILE_FOMAT, ReadFunction } from '../types';
import { TypedArray } from './types';

type AmpReader = Record<
  FILE_FOMAT,
  Record<
    FORMAT_CODE,
    Record<
      number,
      {
        f: ReadFunction;
        arr: TypedArray;
        min: number;
        max: number;
      }
    >
  >
>;

export const AMP_READERS: AmpReader = {
  [FILE_FOMAT.LITTLE_ENDIAN]: {
    [FORMAT_CODE.WAVE_FORMAT_PCM]: {
      1: { f: 'readUIntLE', arr: Uint8Array, min: 0, max: 255 },
      2: { f: 'readIntLE', arr: Int16Array, min: -32768, max: 32767 },
      3: { f: 'readIntLE', arr: Int32Array, min: -8388608, max: 8388607 }
    },
    [FORMAT_CODE.WAVE_FORMAT_IEEE_FLOAT]: {
      4: { f: 'readFloatLE', arr: Float32Array, min: 0, max: 1 },
      8: { f: 'readDoubleLE', arr: Float64Array, min: 0, max: 1 }
    },
    [FORMAT_CODE.WAVE_FORMAT_ALAW]: {
      1: { f: 'readALaw', arr: Int16Array, min: -4032, max: 4032 }
    },
    [FORMAT_CODE.WAVE_FORMAT_MULAW]: {
      1: { f: 'readALaw', arr: Int16Array, min: -4032, max: 4032 }
    },
    [FORMAT_CODE.WAVE_FORMAT_EXTENSIBLE]: {}
  },
  [FILE_FOMAT.BIG_ENDIAN]: {
    [FORMAT_CODE.WAVE_FORMAT_PCM]: {
      1: { f: 'readUIntBE', arr: Uint8Array, min: 0, max: 255 },
      2: { f: 'readIntBE', arr: Int16Array, min: -32768, max: 32767 },
      3: { f: 'readIntBE', arr: Int32Array, min: -8388608, max: 8388607 }
    },
    [FORMAT_CODE.WAVE_FORMAT_IEEE_FLOAT]: {
      4: { f: 'readFloatBE', arr: Float32Array, min: 0, max: 1 },
      8: { f: 'readDoubleBE', arr: Float64Array, min: 0, max: 1 }
    },
    [FORMAT_CODE.WAVE_FORMAT_ALAW]: {
      1: { f: 'readALaw', arr: Int16Array, min: -4032, max: 4032 }
    },
    [FORMAT_CODE.WAVE_FORMAT_MULAW]: {
      1: { f: 'readALaw', arr: Int16Array, min: -4032, max: 4032 }
    },
    [FORMAT_CODE.WAVE_FORMAT_EXTENSIBLE]: {}
  }
};
