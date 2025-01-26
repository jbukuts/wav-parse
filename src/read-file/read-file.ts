import parseHead, { ParsedHead } from '../parse-header/parse-head';
import { FORMAT_CODE, FILE_FOMAT } from '../types';
import { AMP_READERS } from './constants';

export type ReadFile = ParsedHead['header'] & {
  amplitudeData: (
    | Uint8Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    | Float64Array
  )[];
};

/**
 * Read WAV file metadata and amplitude data.
 * Allows for amplitudes to be normalized to new range.
 *
 * @param opts
 * @returns
 */
export default function readFile(buffer: Buffer): ReadFile {
  // get header metadata
  const header = parseHead(buffer);

  const {
    offset: headOffset,
    header: {
      chunkId,
      fmt: { formatType, bitsPerSample, channels, subCode },
      data: { chunkSz }
    }
  } = header;

  const code: FORMAT_CODE = subCode ?? formatType;
  const bytesPerSample = bitsPerSample / 8;
  const { f: readerFunction, arr: ArrayType } =
    AMP_READERS[chunkId as FILE_FOMAT][code][bytesPerSample];

  const sampleLength = chunkSz / bytesPerSample / channels;
  const amplitudeData = [...new Array(channels)].map(() =>
    new ArrayType(sampleLength).fill(0)
  );

  // start reading from end of header
  let offset = headOffset;
  for (let sample = 0; sample < sampleLength; sample++) {
    for (let channel = 0; channel < channels; channel++) {
      // read amplitude data
      const value = buffer[readerFunction](offset, bytesPerSample);

      // insert into proper channel at correct sample index
      amplitudeData[channel][sample] = value as number;

      // increment offset
      offset += bytesPerSample;
    }
  }

  return {
    ...header.header,
    amplitudeData
  };
}
