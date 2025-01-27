import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { readFile } from 'src';

const TESTS = [
  {
    title: 'normal signed int16 file',
    path: 'M1F1-int16-AFsp.wav',
    expected: [16, 1, undefined]
  },
  {
    title: 'normal signed int32 file',
    path: 'M1F1-int32-AFsp.wav',
    expected: [32, 1, undefined]
  },
  {
    title: 'extended unsigned int8 file',
    path: 'M1F1-uint8WE-AFsp.wav',
    expected: [8, 65534, 1]
  },
  {
    title: 'extended signed int24 file',
    path: 'M1F1-int24WE-AFsp.wav',
    expected: [24, 65534, 1]
  },
  {
    title: 'extended signed int32 file',
    path: 'M1F1-int32WE-AFsp.wav',
    expected: [32, 65534, 1]
  },
  {
    title: 'extended float32 file',
    path: 'M1F1-float32WE-AFsp.wav',
    expected: [32, 65534, 3]
  },
  {
    title: 'A-law encoded file',
    path: 'M1F1-Alaw-AFsp.wav',
    expected: [8, 6, undefined]
  }
];

describe('wav-parse', () => {
  for (const t of TESTS) {
    const { title, path, expected } = t;

    it(`can parse ${title}`, () => {
      const [bps, fmtType, subCode] = expected;

      const b = fs.readFileSync(`./test_files/${path}`);
      const { fmt } = readFile(b);

      expect(fmt.bitsPerSample).toBe(bps);
      expect(fmt.formatType).toBe(fmtType);
      expect(fmt.subCode).toBe(subCode);
    });
  }
});
