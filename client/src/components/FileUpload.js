import React, { Fragment, useState } from 'react';
import { isEmpty } from 'lodash';

import axios from '../request/axios';
import Message from './Message';
import Progress from './Progress';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadedFile, setUploadedFile] = useState({});

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          Math.round(setUploadPercentage((progressEvent.loaded * 100) / progressEvent.total))
        }
      })
      setTimeout(() => {
        setUploadPercentage(0)
      }, 10000);
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMessage('File Uploaded');
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setMessage(`Bad Request: ${data.error}`)
        } else if (status === 500) {
          setMessage(`Server Error: ${data.error}`)
        } else {
          setMessage(`Unknown Error: ${data.error}`)
        }
      } else {
        setMessage(`An unexpected error occurred. Please tyr again later.`)
      }
      setUploadPercentage(0);
      setUploadedFile({});
    }
  }

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='input-group mb-3'>
          <input type='file' className='form-control'
            onChange={onChange} />
        </div>
        <Progress percentage={uploadPercentage} />
        <input type='submit' value="Upload" className='btn btn-primary mt-4' />
      </form>
      {
        // uploadedFile is an object
      }
      {!isEmpty(uploadedFile)
        ? (<div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img alt='upload' style={{ width: "100%" }} src={uploadedFile.filePath} />
          </div>
        </div>)
        : null}
    </Fragment>
  )
}

export default FileUpload;