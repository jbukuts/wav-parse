# wav-parse

This is a WAV file parser designed to extract header metadata and amplitude data from WAV files. It is written to support a multitude of WAV file encodings including:

- Little/big endian encoding
- WAV Extensible data
  - A-law amplitude data
  - Mu-law amplitude data
  - Uncommon header chunks like `fact`/`peak`

## Examples

```ts
// start by getting the byte data of a given WAV file
const buffer = fs.readFileSync('./test.wav')

// read just the header info
const { header, offset } = parseHead(buffer)
// offset represents the byte-size of the header.

// or read the header and all amplitude data
const { 
  chunkId,
  chunkSz,
  type,
  data,
  fmt,
  fact,
  peak
  amplitudeData,
} = readFile(buffer)
// amplitudeData will be a TypedArray
```
