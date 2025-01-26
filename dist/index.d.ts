import { Buffer } from 'buffer/index';

type Nullable<T> = T | null | undefined;

type ValueType = 'uint' | 'int' | 'float' | 'string';

/**
 * Represents the start of each chunk
 */
declare const GENERIC_CHUNK: {
    readonly chunkId: {
        readonly type: "string";
        readonly sz: 4;
    };
    readonly chunkSz: {
        readonly type: "uint";
        readonly sz: 4;
    };
};
/**
 * Start chunk of every wav file
 */
declare const COMMON_CHUNK: {
    readonly type: {
        readonly type: "string";
        readonly sz: 4;
    };
    readonly chunkId: {
        readonly type: "string";
        readonly sz: 4;
    };
    readonly chunkSz: {
        readonly type: "uint";
        readonly sz: 4;
    };
};
/**
 * table representations of each header chunk
 * default id and sz values are ommited as they must always be there
 */
declare const SUPP_HEADER_CHUNKS: {
    readonly fmt: {
        readonly formatType: {
            readonly type: "uint";
            readonly sz: 2;
        };
        readonly channels: {
            readonly type: "uint";
            readonly sz: 2;
        };
        readonly samplesRate: {
            readonly type: "uint";
            readonly sz: 4;
        };
        readonly byteRate: {
            readonly type: "uint";
            readonly sz: 4;
        };
        readonly blockAlign: {
            readonly type: "uint";
            readonly sz: 2;
        };
        readonly bitsPerSample: {
            readonly type: "uint";
            readonly sz: 2;
        };
        readonly extSize: {
            readonly type: "uint";
            readonly sz: 2;
            readonly opt: true;
        };
        readonly validBitsPerSample: {
            readonly type: "uint";
            readonly sz: 2;
            readonly opt: true;
        };
        readonly channelMask: {
            readonly type: "uint";
            readonly sz: 4;
            readonly opt: true;
        };
        readonly subCode: {
            readonly type: "uint";
            readonly sz: 2;
            readonly opt: true;
        };
        readonly subFormat: {
            readonly type: "string";
            readonly sz: 14;
            readonly opt: true;
        };
    };
    readonly fact: {
        readonly sampleLength: {
            readonly type: "uint";
            readonly sz: 4;
        };
    };
    readonly peak: {
        readonly version: {
            readonly type: "uint";
            readonly sz: 4;
        };
        readonly timeStamp: {
            readonly type: "uint";
            readonly sz: 4;
        };
        readonly leftChannelPeakValue: {
            readonly type: "float";
            readonly sz: 4;
        };
        readonly leftChannelPeakPos: {
            readonly type: "uint";
            readonly sz: 4;
        };
        readonly rightChannelPeakValue: {
            readonly type: "float";
            readonly sz: 4;
        };
        readonly rightChannelPeakPos: {
            readonly type: "uint";
            readonly sz: 4;
        };
    };
};

/**
 * Abstract representation of individual chunk data
 */
interface HeaderChunk {
    /**
     * represents an individual item within a chunk
     */
    [x: string]: {
        /**
         * type of value
         */
        type: ValueType;
        /**
         * size of value
         */
        sz: number;
        /**
         * whether the value is optional within the chunk
         */
        opt?: boolean;
    };
}
/**
 * Represents a given abstract chunk table as an object
 */
type ChunkAsObject<T extends HeaderChunk> = {
    [K in keyof T as K]: T[K]['opt'] extends true ? Nullable<T[K]['type'] extends 'string' ? string : number> : Required<T[K]['type'] extends 'string' ? string : number>;
};
type FinalChunkObject<C extends HeaderChunk> = ChunkAsObject<C> & ChunkAsObject<typeof GENERIC_CHUNK>;
/**
 * Encompasses all header metadata
 */
interface Header extends ChunkAsObject<typeof COMMON_CHUNK> {
    fmt: FinalChunkObject<(typeof SUPP_HEADER_CHUNKS)['fmt']>;
    fact?: FinalChunkObject<(typeof SUPP_HEADER_CHUNKS)['fact']>;
    peak?: FinalChunkObject<(typeof SUPP_HEADER_CHUNKS)['peak']>;
    data: FinalChunkObject<typeof GENERIC_CHUNK>;
}

type ParsedHead = {
    header: Header;
    offset: number;
};
/**
 * Parse metadata associated with a given buffer representing byte data of wav file
 *
 * @param buffer represents byte data of wav file
 * @returns
 */
declare function parseHead(data: Buffer | ArrayBuffer): ParsedHead;

type TypedArray = Int8Array | Uint8Array | Int16Array | Int32Array | Float32Array | Float64Array;

type ReadFile = ParsedHead['header'] & {
    amplitudeData: TypedArray[];
};
/**
 * Read WAV file metadata and amplitude data.
 * Allows for amplitudes to be normalized to new range.
 *
 * @param opts
 * @returns
 */
declare function readFile(data: Buffer | ArrayBuffer): ReadFile;

export { parseHead, readFile };
