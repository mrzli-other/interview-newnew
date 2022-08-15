import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function App() {
  const [filesToUpload, setFilesToUpload] = useState<readonly File[]>([]);
  const [lastUploadedFileLinks, setLastUploadedFileLinks] = useState<
    readonly string[]
  >([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // setFilesToUpload((s) => [...s, ...acceptedFiles]);
      setFilesToUpload((s) => [...acceptedFiles]);
    },
    [setFilesToUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'video/mp4': [],
    },
    multiple: false,
  });

  const uploadFilesHandler = useCallback(() => {
    async function uploadFileCall(): Promise<void> {
      if (filesToUpload.length !== 1) {
        return;
      }

      const response = await uploadFile(filesToUpload[0]);
      if (response.ok) {
        console.log('File upload successful.');
        const links: readonly string[] = await response.json();
        console.log(links);
        setLastUploadedFileLinks(links);
      } else {
        console.error('Upload failed!');
      }
    }

    uploadFileCall();
  }, [filesToUpload, setLastUploadedFileLinks]);

  // const refreshUploadedFilesHandler = useCallback(() => {
  //   console.log('refresh');
  // }, []);

  return (
    <div
      style={{ padding: 10, display: 'grid', gap: 10, justifyContent: 'start' }}
    >
      <div
        {...getRootProps()}
        style={{
          display: 'inline-block',
          height: 100,
          minWidth: 400,
          backgroundColor: '#CCCCCC',
          padding: 10,
          overflow: 'auto',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div>Drop the files here ...</div>
        ) : (
          <div>Drag 'n' drop some files here, or click to select files</div>
        )}
        <br />
        <div>Only '.jpeg', '.png' and '.mp4' file will be accepted.</div>
      </div>
      <div>
        <div>Files to Upload (currently only one at a time):</div>
        {filesToUpload.length > 0 ? (
          filesToUpload.map((f, index) => <div key={index}>- {f.name}</div>)
        ) : (
          <div>No files to upload yet.</div>
        )}
      </div>
      <button
        onClick={uploadFilesHandler}
        disabled={filesToUpload.length === 0}
      >
        Upload
      </button>
      <div>
        <div>Last Uploaded File Links:</div>
        {lastUploadedFileLinks.length > 0 ? (
          lastUploadedFileLinks.map((l, index) => (
            <div key={index}>
              <a href={l} target="_blank" rel="noopener noreferrer">
                {l}
              </a>
            </div>
          ))
        ) : (
          <div>None</div>
        )}
      </div>
      {/* <button onAbort={refreshUploadedFilesHandler}>
        Refresh Uploaded Files from Server
      </button>
      <div>Uploaded files:</div>
      <div></div> */}
    </div>
  );
}

async function uploadFile(file: File): Promise<Response> {
  const formData = new FormData();
  formData.append('file', file, file.name);

  return await fetch('/api/upload-file', {
    method: 'POST',
    body: formData,
  });
}

// async function uploadFiles(files: readonly File[]): Promise<Response> {
//   const formData = new FormData();
//   for (const file of files) {
//     formData.append('files[]', file, getServerFileName(file));
//   }

//   return await fetch('/api/upload-files', {
//     method: 'POST',
//     body: formData,
//   });
// }
