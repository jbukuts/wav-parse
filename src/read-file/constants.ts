import { FORMAT_CODE, FILE_FOMAT, ReadFunction } from '../types';
import type { TypedArray } from './types';
import type { Constructor } from 'type-fest';

type AmpReader = Record<
  FILE_FOMAT,
  Record<
    FORMAT_CODE,
    Record<
      number,
      {
        f: ReadFunction;
        arr: Constructor<TypedArray>;
      }
    >
  >
>;

export const AMP_READERS: AmpReader = {
  [FILE_FOMAT.LITTLE_ENDIAN]: {
    [FORMAT_CODE.WAVE_FORMAT_PCM]: {
      1: { f: 'readUIntLE', arr: Uint8Array },
      2: { f: 'readIntLE', arr: Int16Array },
      3: { f: 'readIntLE', arr: Int32Array },
      4: { f: 'readIntLE', arr: Int32Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_IEEE_FLOAT]: {
      4: { f: 'readFloatLE', arr: Float32Array },
      8: { f: 'readDoubleLE', arr: Float64Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_ALAW]: {
      1: { f: 'readALaw', arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_MULAW]: {
      1: { f: 'readALaw', arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_EXTENSIBLE]: {}
  },
  [FILE_FOMAT.BIG_ENDIAN]: {
    [FORMAT_CODE.WAVE_FORMAT_PCM]: {
      1: { f: 'readUIntBE', arr: Uint8Array },
      2: { f: 'readIntBE', arr: Int16Array },
      3: { f: 'readIntBE', arr: Int32Array },
      4: { f: 'readIntBE', arr: Int32Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_IEEE_FLOAT]: {
      4: { f: 'readFloatBE', arr: Float32Array },
      8: { f: 'readDoubleBE', arr: Float64Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_ALAW]: {
      1: { f: 'readALaw', arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_MULAW]: {
      1: { f: 'readALaw', arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_EXTENSIBLE]: {}
  }
};
