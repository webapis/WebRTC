
import { useState, useEffect } from 'react';

const BYTES_PER_CHUNK = 100;
export default function useFileReader() {
  const [files, setFiles] = useState(null);
  const [file, setFile] = useState(null);
  const [slices, setSlices] = useState([]);
  const [fileChunk, setFileChunk] = useState(null);
  const [reader, setReader] = useState(null);
  const [readComplete, setReadComplete] = useState(false);
  const [error, setError] = useState(null);
  const [nextSlice, setNextSlice] = useState(0);
  const [readProgress, setReadProcess] = useState(0);
  const [bytesRead, setBytesRead] = useState(0);

  function sliceFile() {
    const {size} = file;
    let start = 0;
    const list = [];
    while (start < size) {
      const end = Math.min(size, start + BYTES_PER_CHUNK);
      list.push({ start, end });
      start += BYTES_PER_CHUNK;
    }
    setSlices(list);
  }

  function createFileReader() {
    const rd = new FileReader();
    rd.onerror = err => {
      setError(err);
    };
    rd.onloadend = r => {
      if (r.target.readyState === FileReader.DONE) {
        const chunk = r.target.result;
        setFileChunk(chunk);
        setBytesRead(preState => preState + chunk.byteLength);
      }
    };

    setReader(rd);
  }

  // 1. Create FileReader on component's first mount
  useEffect(() => {
    if (slices) {
      createFileReader();
    }
  }, [slices]);

  // 2.file state changes after user selects a file
  useEffect(() => {
    if (files) {
      setFile(files[0]);
      setNextSlice(0);
      setReadComplete(false);
      setReadProcess(0);
      setBytesRead(0);
      setFileChunk(null);

      if (reader) {
        reader.onerror = null;
        reader.onloadend = null;
        setReader(null);
      }
    }
  }, [files]);

  // 4. After file state chage files gets sliced and put into slices array for later use
  useEffect(() => {
    if (file) {
      sliceFile(file);
    }
  }, [file]);

  // 5.After File slice gets read by File Reader setBytesRead
  useEffect(() => {
    if (fileChunk) {
      const progress = (
        ((bytesRead + fileChunk.byteLength) / file.size) *
        100
      ).toFixed();
      // eslint-disable-next-line radix
      setReadProcess(Number.parseInt(progress));
    }
  }, [fileChunk]);

  // 6.After bytesRead change set readProgress

  useEffect(() => {
    if (file && bytesRead === file.size) {
      setReadComplete(true);
    }
  }, [bytesRead]);

  function handleFileChange(e) {
    setFiles(e.target.files);
  }

  



  function startReadingFileBySlice() {

    if (nextSlice < slices.length) {

      reader.readAsArrayBuffer(
        file.slice(slices[nextSlice].start, slices[nextSlice].end)
      );
      setNextSlice(prev => prev+1);
    }
  }

  function resetFileReaderState() {
    setFiles(null);
    setFile(null);
    setSlices([]);
    setFileChunk(null);
    setReadComplete(false);
    setError(false);
    setNextSlice(0);
    setReadProcess(0);
    setBytesRead(0);
    if (reader) {
      reader.onerror = null;
      reader.onloadend = null;
      setReader(null);
    }
  }

  return {
    handleFileChange,
    file,
    fileChunk,
    startReadingFileBySlice,
    error,
    readProgress,
    readComplete,
    resetFileReaderState
  };
}
