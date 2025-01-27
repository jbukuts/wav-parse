import { ChangeEvent, useState } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { parseHead } from 'wav-parse';

const readFileAsArrayBuffer = async (
  file: File
): Promise<ArrayBuffer | null> => {
  const reader = new FileReader();

  return new Promise((res) => {
    reader.onload = (event) => {
      const result = event.target?.result as ArrayBuffer;
      res(result);
    };

    reader.onerror = (err) => {
      console.error(err);
      res(null);
    };

    reader.readAsArrayBuffer(file);
  });
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [header, setHeader] =
    useState<ReturnType<typeof parseHead>['header']>();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleProcessing = async () => {
    if (file === null) return;
    const buffer = await readFileAsArrayBuffer(file);
    if (buffer === null) return;
    const { header: h } = parseHead(buffer);
    setHeader(h);
  };

  return (
    <div className='w-[500px] flex flex-col gap-2.5'>
      <div className='flex'>
        <Input type='file' accept='audio/wav' onChange={handleFileChange} />
        <Button onClick={handleProcessing} disabled={file === null}>
          Process
        </Button>
      </div>
      {header && (
        <code className='text-xs'>
          <pre>{JSON.stringify(header, null, 2)}</pre>
        </code>
      )}
    </div>
  );
}

export default App;
