import React, { useState } from 'react';

const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [method, setMethod] = useState('caesar');
  const [shift, setShift] = useState(3);
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [operation, setOperation] = useState('encrypt'); // Default operation
  const [errorMessage, setErrorMessage] = useState('');

  // Caesar cipher encryption function
  const encryptCaesar = (text, shift) => {
    return text.replace(/[a-z]/gi, (char) => {
      const start = char <= 'Z' ? 65 : 97; // ASCII value for 'A' or 'a'
      return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26) + start);
    });
  };

  // Caesar cipher decryption function
  const decryptCaesar = (text, shift) => {
    return encryptCaesar(text, 26 - shift); // Decrypting is the same as encrypting with (26 - shift)
  };

  // Base64 encryption function
  const encodeBase64 = (text) => {
    return btoa(text);
  };

  // Base64 decryption function
  const decodeBase64 = (encodedText) => {
    try {
      return atob(encodedText);
    } catch (error) {
      return 'Invalid Base64 string';
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const intervalId = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const nextProgress = prevProgress + 10;
          if (nextProgress >= 100) {
            clearInterval(intervalId);
            const reader = new FileReader();
            reader.onload = function (e) {
              const text = e.target.result;
              let processedText;
              if (operation === 'encrypt') {
                if (method === 'caesar') {
                  processedText = encryptCaesar(text, shift);
                } else if (method === 'base64') {
                  processedText = encodeBase64(text);
                }
                setEncryptedText(processedText);
                setDecryptedText('');
              } else if (operation === 'decrypt') {
                if (method === 'caesar') {
                  processedText = decryptCaesar(text, shift);
                } else if (method === 'base64') {
                  processedText = decodeBase64(text);
                }
                setDecryptedText(processedText);
                setEncryptedText('');
              }
              setErrorMessage('');
              const storedData = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
              const fileData = {
                name: file.name,
                type: file.type,
                content: e.target.result,
                processedText
              };

              storedData.push(fileData);
              localStorage.setItem('uploadedFiles', JSON.stringify(storedData));
            };
            reader.onerror = function (e) {
              setErrorMessage('Error reading file');
              setEncryptedText('');
              setDecryptedText('');
            };
            reader.readAsText(file);
            return 100;
          }
          return nextProgress;
        });
      }, 500);
    } else {
      setErrorMessage('Please upload a valid text file');
      setEncryptedText('');
      setDecryptedText('');
    }
  };

  // Handle decryption
  const handleDecrypt = () => {
    let decrypted;
    if (method === 'caesar') {
      decrypted = decryptCaesar(encryptedText, shift);
    } else if (method === 'base64') {
      decrypted = decodeBase64(encryptedText);
    }
    setDecryptedText(decrypted);
  };

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 bg-white mt-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="mb-4">
        <label>
          Select Operation:
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Method:
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="caesar">Caesar Cipher</option>
            <option value="base64">Base64</option>
          </select>
        </label>
      </div>
      {method === 'caesar' && (
        <div className="mb-4">
          <label className="text-sm text-gray-700">
            Shift Key:
            <input
              type="number"
              value={shift}
              className="text-sm text-gray-700"
              onChange={(e) => setShift(Number(e.target.value))}
              min="0"
              max="25"
            />
          </label>
        </div>
      )}
      <div className="mb-4">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      {encryptedText && (
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Encrypted Text:</h2>
          <textarea
            rows="10"
            readOnly
            value={encryptedText}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleDecrypt}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Decrypt
          </button>
          <button
            onClick={() => handleDownload(encryptedText, 'encrypted.txt')}
            className="mt-2 ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Download Encrypted Text
          </button>
        </div>
      )}
      {decryptedText && (
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Decrypted Text:</h2>
          <textarea
            rows="10"
            readOnly
            value={decryptedText}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => handleDownload(decryptedText, 'decrypted.txt')}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Download Decrypted Text
          </button>
        </div>
      )}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-indigo-600"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;





