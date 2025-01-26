import { ValueType } from 'src/constant';
import { Nullable } from 'src/types';
import type {
  GENERIC_CHUNK,
  COMMON_CHUNK,
  SUPP_HEADER_CHUNKS
} from './constants';

/**
 * Abstract representation of individual chunk data
 */
export interface HeaderChunk {
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
export type ChunkAsObject<T extends HeaderChunk> = {
  [K in keyof T as K]: T[K]['opt'] extends true
    ? Nullable<T[K]['type'] extends 'string' ? string : number>
    : Required<T[K]['type'] extends 'string' ? string : number>;
};

type FinalChunkObject<C extends HeaderChunk> = ChunkAsObject<C> &
  ChunkAsObject<typeof GENERIC_CHUNK>;

/**
 * Encompasses all header metadata
 */
export interface Header extends ChunkAsObject<typeof COMMON_CHUNK> {
  fmt: FinalChunkObject<(typeof SUPP_HEADER_CHUNKS)['fmt']>;
  fact?: FinalChunkObject<(typeof SUPP_HEADER_CHUNKS)['fact']>;
  peak?: FinalChunkObject<(typeof SUPP_HEADER_CHUNKS)['peak']>;
  data: FinalChunkObject<typeof GENERIC_CHUNK>;
}
