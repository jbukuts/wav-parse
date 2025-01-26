import { HeaderChunk } from './types';

/**
 * Represents the start of each chunk
 */
export const GENERIC_CHUNK = {
  chunkId: { type: 'string', sz: 4 },
  chunkSz: { type: 'uint', sz: 4 }
} as const satisfies HeaderChunk;

/**
 * Start chunk of every wav file
 */
export const COMMON_CHUNK = {
  ...GENERIC_CHUNK,
  type: { type: 'string', sz: 4 }
} as const satisfies HeaderChunk;

/**
 * table representations of each header chunk
 * default id and sz values are ommited as they must always be there
 */
export const SUPP_HEADER_CHUNKS = {
  fmt: {
    formatType: { type: 'uint', sz: 2 },
    channels: { type: 'uint', sz: 2 },
    samplesRate: { type: 'uint', sz: 4 },
    byteRate: { type: 'uint', sz: 4 },
    blockAlign: { type: 'uint', sz: 2 },
    bitsPerSample: { type: 'uint', sz: 2 },
    extSize: { type: 'uint', sz: 2, opt: true },
    validBitsPerSample: { type: 'uint', sz: 2, opt: true },
    channelMask: { type: 'uint', sz: 4, opt: true },
    subCode: { type: 'uint', sz: 2, opt: true },
    subFormat: { type: 'string', sz: 14, opt: true }
  },
  fact: {
    sampleLength: { type: 'uint', sz: 4 }
  },
  peak: {
    version: { type: 'uint', sz: 4 },
    timeStamp: { type: 'uint', sz: 4 },
    leftChannelPeakValue: { type: 'float', sz: 4 },
    leftChannelPeakPos: { type: 'uint', sz: 4 },
    rightChannelPeakValue: { type: 'float', sz: 4 },
    rightChannelPeakPos: { type: 'uint', sz: 4 }
  }
} as const satisfies Record<string, HeaderChunk>;
