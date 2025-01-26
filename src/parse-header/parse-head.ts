import { BYTE_READERS } from 'src/constant';
import { ChunkAsObject, Header, HeaderChunk } from './types';
import { COMMON_CHUNK, GENERIC_CHUNK, SUPP_HEADER_CHUNKS } from './constants';
import type { Buffer as BrowserBuffer } from 'buffer/index';
import { ExtendedBuffer } from 'src/extended-buffer';

export type ParsedHead = {
  header: Header;
  offset: number;
};

/**
 * Parse metadata associated with a given buffer representing byte data of wav file
 *
 * @param buffer represents byte data of wav file
 * @returns
 */
export default function parseHead(
  data: BrowserBuffer | ArrayBuffer
): ParsedHead {
  let offset = 0;
  const buffer = ExtendedBuffer(data);

  // helper to read given chunk
  const readChunk = <T extends HeaderChunk>(table: T, chnkSize?: number) => {
    const data: Record<string, unknown> = {};

    const max = chnkSize !== undefined ? offset + chnkSize : Number.MAX_VALUE;
    for (const key of Object.keys(table)) {
      if (offset >= max) break;

      const { sz, type } = table[key];
      const reader = BYTE_READERS[type][sz];

      // @ts-expect-error some fucntions have no second param
      const val = buffer[reader](offset, sz);
      data[key] = val;
      offset += sz;
    }

    return data as ChunkAsObject<T>;
  };

  let header: Record<string, object | string | number> = {};
  const common = readChunk(COMMON_CHUNK);
  header = { ...common };

  const fileSize = common.chunkSz;
  while (offset < fileSize) {
    // determine chunk id and size
    const genericData = readChunk(GENERIC_CHUNK);
    const { chunkId, chunkSz } = genericData;
    const id = chunkId.toLowerCase().trim();

    // if not in the header skip it but add basic data
    if (!(id in SUPP_HEADER_CHUNKS)) {
      header[id] = {
        ...genericData
      };
      if (id === 'data') break;
      console.error(`${id} not in HEADER table`);
      offset += chunkSz;
      continue;
    }

    // read chunk and add to object
    const table = SUPP_HEADER_CHUNKS[id as keyof typeof SUPP_HEADER_CHUNKS];
    const d = readChunk(table, chunkSz);
    header[id] = {
      ...genericData,
      ...d
    };
  }

  return {
    header: header as unknown as Header,
    offset
  };
}
