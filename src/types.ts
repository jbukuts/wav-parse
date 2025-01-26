/**
 * format code representing how byte data is stored
 */
export enum FORMAT_CODE {
  WAVE_FORMAT_PCM = 1,
  WAVE_FORMAT_IEEE_FLOAT = 3,
  WAVE_FORMAT_ALAW = 6,
  WAVE_FORMAT_MULAW = 7,
  WAVE_FORMAT_EXTENSIBLE = 65534
}

/**
 * supported file formats
 */
export enum FILE_FOMAT {
  LITTLE_ENDIAN = 'RIFF',
  BIG_ENDIAN = 'RIFX'
}

export type PickMatching<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

export type Nullable<T> = T | null | undefined;

export type ReadFunction = keyof Pick<
  Buffer,
  | 'readUInt8'
  | 'readUIntLE'
  | 'readIntLE'
  | 'readFloatLE'
  | 'readDoubleLE'
  | 'readUIntBE'
  | 'readIntBE'
  | 'readFloatBE'
  | 'readDoubleBE'
  | 'readString'
  | 'readALaw'
>;

// export type ReaderFunc = keyof PickMatching<
//   Buffer,
//   (offset: number, byteLength: number) => number | string
// >;
