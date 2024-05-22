import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import FileUpload from './Components/FileUploaded/FileUpload';

const SECRET_PASS = 'WjgYF4eV2s2V';

const App = () => {
  const [text, setText] = useState('');
  const [screen, setScreen] = useState('encrypt');
  const [encryptionMethod, setEncryptionMethod] = useState('AES'); // Track the selected encryption method

  const [errorMessage, setErrorMessage] = useState('');

  // Store Encrypted and Decrypted data
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState('');

  // Switch between encrypt and decrypt screens
  const switchScreen = (type) => {
    setScreen(type);
    // Clear all data and error message when switching screens
    setText('');
    setEncryptedData('');
    setDecryptedData('');
    setErrorMessage('');
  };

  // Encrypt user input text using AES
  const encryptDataAES = () => {
    try {
      const data = CryptoJS.AES.encrypt(JSON.stringify(text), SECRET_PASS).toString();
      setEncryptedData(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Encryption failed. Please check your input.');
    }
  };

  // Decrypt user input text using AES
  const decryptDataAES = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(text, SECRET_PASS);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Decryption failed. Please check your input.');
    }
  };

  // Encrypt user input text using Caesar Cipher
  const encryptDataCaesar = (shift) => {
    try {
      const data = text.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + shift) ? c : c - 26))
      );
      setEncryptedData(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Encryption failed. Please check your input.');
    }
  };

  // Decrypt user input text using Caesar Cipher
  const decryptDataCaesar = (shift) => {
    try {
      const data = text.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) - shift) ? c : c + 26))
      );
      setDecryptedData(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Decryption failed. Please check your input.');
    }
  };

  // Handle button click {Encrypt or Decrypt}
  const handleClick = () => {
    if (!text) {
      setErrorMessage('Please enter some text.');
      return;
    }

    if (encryptionMethod === 'AES') {
      if (screen === 'encrypt') {
        encryptDataAES();
      } else {
        decryptDataAES();
      }
    } else if (encryptionMethod === 'Caesar') {
      const shift = 3; // You can change the shift value if needed
      if (screen === 'encrypt') {
        encryptDataCaesar(shift);
      } else {
        decryptDataCaesar(shift);
      }
    }
  };

  return (
    <div className='container mx-auto p-4 max-w-3xl'>
      <div>
        <h1 className='text-3xl font-bold mb-4 text-center'>Text File Encryptor</h1>
        <div className='flex justify-center mb-4'>
          {/* Buttons to switch between Encrypt and Decrypt screens */}
          <button
            className={`btn btn-left px-4 py-2 mx-2 rounded-lg ${screen === 'encrypt' ? 'bg-red-500 text-white' : 'bg-gray-200'} transition-colors duration-200`}
            onClick={() => switchScreen('encrypt')}
          >
            Encrypt
          </button>
          <button
            className={`btn btn-right px-4 py-2 mx-2 rounded-lg ${screen === 'decrypt' ? 'bg-blue-500 text-white' : 'bg-gray-200'} transition-colors duration-200`}
            onClick={() => switchScreen('decrypt')}
          >
            Decrypt
          </button>
        </div>
        <div className='card bg-white shadow-lg p-6 rounded-lg'>
          {/* Textarea for user input */}
          <textarea
            className='w-full p-3 border border-gray-300 rounded-lg mb-4'
            value={text}
            onChange={({ target }) => setText(target.value)}
            placeholder={screen === 'encrypt' ? 'Enter Your Text' : 'Enter Encrypted Data'}
          />
          {/* Encryption Method Selector */}
          <div className='flex justify-around mb-4'>
            <label className='flex items-center'>
              <input
                className='mr-2'
                type='radio'
                value='AES'
                checked={encryptionMethod === 'AES'}
                onChange={() => setEncryptionMethod('AES')}
              />
              AES
            </label>
            <label className='flex items-center'>
              <input
                className='mr-2'
                type='radio'
                value='Caesar'
                checked={encryptionMethod === 'Caesar'}
                onChange={() => setEncryptionMethod('Caesar')}
              />
              Caesar
            </label>
          </div>
          {/* Display error message if there's an error */}
          {errorMessage && <div className='error text-red-500 mb-4'>{errorMessage}</div>}
          {/* Encrypt or Decrypt button */}
          <button
            className={`btn submit-btn w-full py-2 rounded-lg ${screen === 'encrypt' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} transition-colors duration-200`}
            onClick={handleClick}
          >
            {screen === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
        </div>
        {/* Display encrypted or decrypted data if available */}
        {(encryptedData || decryptedData) && (
          <div className='content mt-4 p-4 bg-gray-100 rounded-lg'>
            <label className='block text-lg font-semibold mb-2'>{screen === 'encrypt' ? 'ENCRYPTED' : 'DECRYPTED'} DATA</label>
            <p className='whitespace-pre-wrap break-words'>{screen === 'encrypt' ? encryptedData : decryptedData}</p>
          </div>
        )}
      </div>
      <FileUpload />
    </div>
  );
};

export default App;
