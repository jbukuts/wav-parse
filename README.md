# wav-parse

This is a WAV file parser designed to extract header metadata and amplitude data from WAV files. It is written to support a multitude of WAV file encodings including:

- Little/big endian encoding
- WAV Extensible data
  - A-law amplitude data
  - ~Mu-law amplitude data~ (need to add reader function)
  - Uncommon header chunks like `fact`/`peak`

> This package is designed to run in both browser and Node environments. Because of this `feross/buffer` is being used under the hood to facilitate this and allow me to extend the `Buffer` class with custom readers without affecting the native `Buffer` in Node.

## Examples

### Using Node

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

### In the browser

```ts
// get a File object somehow

const readFileAsArrayBuffer = async (f: File): Promise<ArrayBuffer> => {
  const reader = new FileReader();

  return new Promise((res) => {
    reader.onload = (event) => {
      const result = event.target?.result as ArrayBuffer;
      res(result);
    };

    reader.readAsArrayBuffer(f);
  });
};

// turn file ref into ArrayBuffer of byte data
const arrBuffer = await readFileAsArrayBuffer(file)

// read the header info
const { header, offset } = parseHead(arrBuffer)
```
