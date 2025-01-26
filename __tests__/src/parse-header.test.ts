import { describe, it } from 'node:test';
import fs from 'fs';
import assert from 'assert';
import { parseHead } from '../../src';

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
  }
];

describe('parseHead', () => {
  for (const t of TESTS) {
    const { title, path, expected } = t;

    it(`can parse header of ${title}`, () => {
      const [bps, fmtType, subCode] = expected;

      const b = fs.readFileSync(`./test_files/${path}`);
      const { header } = parseHead(b);

      assert.strictEqual(header.fmt.bitsPerSample, bps);
      assert.strictEqual(header.fmt.formatType, fmtType);
      assert.strictEqual(header.fmt.subCode, subCode);
    });
  }
});
