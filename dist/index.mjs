import { Buffer } from 'buffer/index';

const BYTE_READERS = {
  string: new Proxy({}, { get: () => "readString" }),
  uint: new Proxy({}, { get: () => "readUIntLE" }),
  int: new Proxy({}, { get: () => "readIntLE" }),
  float: {
    4: "readFloatLE",
    8: "readDoubleLE"
  }
};

const GENERIC_CHUNK = {
  chunkId: { type: "string", sz: 4 },
  chunkSz: { type: "uint", sz: 4 }
};
const COMMON_CHUNK = {
  ...GENERIC_CHUNK,
  type: { type: "string", sz: 4 }
};
const SUPP_HEADER_CHUNKS = {
  fmt: {
    formatType: { type: "uint", sz: 2 },
    channels: { type: "uint", sz: 2 },
    samplesRate: { type: "uint", sz: 4 },
    byteRate: { type: "uint", sz: 4 },
    blockAlign: { type: "uint", sz: 2 },
    bitsPerSample: { type: "uint", sz: 2 },
    extSize: { type: "uint", sz: 2, opt: true },
    validBitsPerSample: { type: "uint", sz: 2, opt: true },
    channelMask: { type: "uint", sz: 4, opt: true },
    subCode: { type: "uint", sz: 2, opt: true },
    subFormat: { type: "string", sz: 14, opt: true }
  },
  fact: {
    sampleLength: { type: "uint", sz: 4 }
  },
  peak: {
    version: { type: "uint", sz: 4 },
    timeStamp: { type: "uint", sz: 4 },
    leftChannelPeakValue: { type: "float", sz: 4 },
    leftChannelPeakPos: { type: "uint", sz: 4 },
    rightChannelPeakValue: { type: "float", sz: 4 },
    rightChannelPeakPos: { type: "uint", sz: 4 }
  }
};

function createExtendedBuffer(data) {
  const buf = Buffer.from(data);
  buf.readString = function readString(offset, length) {
    return this.toString("ascii", offset, offset + length);
  };
  buf.readALaw = function readALaw(offset) {
    const v = this.readInt8(offset);
    const str = (v >>> 0).toString(2).slice(-8).padStart(8, "0");
    const sign = parseInt(str.slice(0, 1), 2) === 0 ? 1 : 0;
    const exp = parseInt(str.slice(1, 4), 2);
    const mantissa = parseInt(str.slice(4), 2);
    return (-1) ** sign * (16 * Math.min(1, exp) + mantissa + 0.5) * 2 ** Math.max(1, exp);
  };
  return buf;
}

function parseHead(data) {
  let offset = 0;
  const buffer = createExtendedBuffer(data);
  const readChunk = (table, chnkSize) => {
    const data2 = {};
    const max = chnkSize !== undefined ? offset + chnkSize : Number.MAX_VALUE;
    for (const key of Object.keys(table)) {
      if (offset >= max) break;
      const { sz, type } = table[key];
      const reader = BYTE_READERS[type][sz];
      const val = buffer[reader](offset, sz);
      data2[key] = val;
      offset += sz;
    }
    return data2;
  };
  let header = {};
  const common = readChunk(COMMON_CHUNK);
  header = { ...common };
  const fileSize = common.chunkSz;
  while (offset < fileSize) {
    const genericData = readChunk(GENERIC_CHUNK);
    const { chunkId, chunkSz } = genericData;
    const id = chunkId.toLowerCase().trim();
    if (!(id in SUPP_HEADER_CHUNKS)) {
      header[id] = {
        ...genericData
      };
      if (id === "data") break;
      console.error(`${id} not in HEADER table`);
      offset += chunkSz;
      continue;
    }
    const table = SUPP_HEADER_CHUNKS[id];
    const d = readChunk(table, chunkSz);
    header[id] = {
      ...genericData,
      ...d
    };
  }
  return {
    header,
    offset
  };
}

var FORMAT_CODE = /* @__PURE__ */ ((FORMAT_CODE2) => {
  FORMAT_CODE2[FORMAT_CODE2["WAVE_FORMAT_PCM"] = 1] = "WAVE_FORMAT_PCM";
  FORMAT_CODE2[FORMAT_CODE2["WAVE_FORMAT_IEEE_FLOAT"] = 3] = "WAVE_FORMAT_IEEE_FLOAT";
  FORMAT_CODE2[FORMAT_CODE2["WAVE_FORMAT_ALAW"] = 6] = "WAVE_FORMAT_ALAW";
  FORMAT_CODE2[FORMAT_CODE2["WAVE_FORMAT_MULAW"] = 7] = "WAVE_FORMAT_MULAW";
  FORMAT_CODE2[FORMAT_CODE2["WAVE_FORMAT_EXTENSIBLE"] = 65534] = "WAVE_FORMAT_EXTENSIBLE";
  return FORMAT_CODE2;
})(FORMAT_CODE || {});
var FILE_FOMAT = /* @__PURE__ */ ((FILE_FOMAT2) => {
  FILE_FOMAT2["LITTLE_ENDIAN"] = "RIFF";
  FILE_FOMAT2["BIG_ENDIAN"] = "RIFX";
  return FILE_FOMAT2;
})(FILE_FOMAT || {});

const AMP_READERS = {
  [FILE_FOMAT.LITTLE_ENDIAN]: {
    [FORMAT_CODE.WAVE_FORMAT_PCM]: {
      1: { f: "readUIntLE", arr: Uint8Array },
      2: { f: "readIntLE", arr: Int16Array },
      3: { f: "readIntLE", arr: Int32Array },
      4: { f: "readIntLE", arr: Int32Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_IEEE_FLOAT]: {
      4: { f: "readFloatLE", arr: Float32Array },
      8: { f: "readDoubleLE", arr: Float64Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_ALAW]: {
      1: { f: "readALaw", arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_MULAW]: {
      1: { f: "readALaw", arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_EXTENSIBLE]: {}
  },
  [FILE_FOMAT.BIG_ENDIAN]: {
    [FORMAT_CODE.WAVE_FORMAT_PCM]: {
      1: { f: "readUIntBE", arr: Uint8Array },
      2: { f: "readIntBE", arr: Int16Array },
      3: { f: "readIntBE", arr: Int32Array },
      4: { f: "readIntBE", arr: Int32Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_IEEE_FLOAT]: {
      4: { f: "readFloatBE", arr: Float32Array },
      8: { f: "readDoubleBE", arr: Float64Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_ALAW]: {
      1: { f: "readALaw", arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_MULAW]: {
      1: { f: "readALaw", arr: Int16Array }
    },
    [FORMAT_CODE.WAVE_FORMAT_EXTENSIBLE]: {}
  }
};

function readFile(data) {
  const buffer = createExtendedBuffer(data);
  const header = parseHead(buffer);
  const {
    offset: headOffset,
    header: {
      chunkId,
      fmt: { formatType, bitsPerSample, channels, subCode },
      data: { chunkSz }
    }
  } = header;
  const code = subCode ?? formatType;
  const bytesPerSample = bitsPerSample / 8;
  const { f: readerFunction, arr: ArrayType } = AMP_READERS[chunkId][code][bytesPerSample];
  const sampleLength = chunkSz / bytesPerSample / channels;
  const amplitudeData = [...new Array(channels)].map(
    () => new ArrayType(sampleLength).fill(0)
  );
  let offset = headOffset;
  for (let sample = 0; sample < sampleLength; sample++) {
    for (let channel = 0; channel < channels; channel++) {
      const value = buffer[readerFunction](offset, bytesPerSample);
      amplitudeData[channel][sample] = value;
      offset += bytesPerSample;
    }
  }
  return {
    ...header.header,
    amplitudeData
  };
}

export { parseHead, readFile };
