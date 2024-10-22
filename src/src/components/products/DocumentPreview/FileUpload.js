import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const FileUpload = ({ children, onSelection, supportedFileExtensions, isMultiFile, ...btnProps }, ref) => {
  const fileInputRef = useRef(null);
  const acceptedFileFormats = {
    pdf: "application/pdf"
  }

  const acceptedFiles = () => {
    let files = "";

    if (supportedFileExtensions.includes("PDF")) {
      files += `${acceptedFileFormats.pdf} `;
    }

    return files;
  }

  const openFileBrowser = () => {
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  useImperativeHandle(ref, () => {
    return {
      openFileBrowser
    }
  });

  return (
    <>
      <input 
      type="file" 
      ref={fileInputRef} 
      multiple={isMultiFile}
      onChange={onSelection} 
      accept={supportedFileExtensions && acceptedFiles()}
      style={{ display: 'none' }} 
      />
    </>
  );
};

export default forwardRef(FileUpload);
