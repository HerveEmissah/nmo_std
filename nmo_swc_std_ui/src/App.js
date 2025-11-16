/**
 * File: App.js
 * Author: Herve Emissah
 * Created: 2021-08-15
 * Description: Main React component for the NMO SWC QC web interface.
 *              Handles files folder selection, log viewing, and downloading of standardized files.
 */


import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import logo from './nmo_swc_qc_logo.png';
import LogViewer from './LogViewer';

function App() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [error, setError] = useState(null);
  const [logContent, setLogContent] = useState('');
  const [checkLongConnections, setCheckLongConnections] = useState(true);
  const [stdevX, setStdevX] = useState(6); // Set default value to 6
  const [isSaving, setIsSaving] = useState(false); // State for tracking saving status

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFiles) {
      return;
    }

    setIsSaving(true); // Set saving state to true when saving starts

    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('files', file);
    }

    try {
      // Send a POST request to your backend to handle file upload.
      const response = await fetch('/nmo/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle success response here
      } else {
        // Handle error response here
      }

      // Handle the response (e.g., display a success message).
    } catch (error) {
      // Handle errors (e.g., display an error message).
      console.error('Error uploading files:', error);
    }

    setIsSaving(false); // Set saving state to false when saving ends

  };

  const handleStandardizeClick = async () => {
    try {
      const response = await fetch('/nmo/SWC_STD', {
        method: 'POST',
        body: selectedFiles,
      });

      if (response.ok) {
        window.alert('Standardize process completed successfully.');
      } else {
        window.alert('Failed to complete Standardize process.');
      }
    } catch (error) {
      console.error('Error during Standardize:', error);
      window.alert('Error occurred during Standardize process.');
    }
  };

  const handleAutoConnectClick = async () => {
    try {
      const formData = new FormData();
      for (const file of selectedFiles) {
        formData.append('files', file);
      }
      formData.append('checkLongConnections', checkLongConnections);
      formData.append('stdevX', stdevX);

      const response = await fetch('/nmo/connect_disjoint_subtrees', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        window.alert('AutoConnect process completed successfully.');
      } else {
        window.alert('Failed to complete AutoConnect process.');
      }
    } catch (error) {
      console.error('Error during AutoConnect:', error);
      window.alert('Error occurred during AutoConnect process.');
    }
  };

  const handleCorrectTagClick = async () => {
    try {
      const response = await fetch('/nmo/CorrectTag', {
        method: 'POST',
        body: selectedFiles,
      });

      if (response.ok) {
        window.alert('Tag correction process completed successfully.');
      } else {
        window.alert('Failed to complete Tag correction process.');
      }
    } catch (error) {
      console.error('Error during Tag Correction:', error);
      window.alert('Error occurred during Tag Correction process.');
    }
  };

  const handleDownloadClick = async () => {
    try {
      const timestamp = new Date().toLocaleString('en-US', {
  	month: 'numeric',
  	day: 'numeric',
  	year: 'numeric',
  	hour: 'numeric',
  	minute: 'numeric',
  	second: 'numeric',
  	hour12: false
      }).replace(/[/:,\s]/g, '_');
      const downloadUrl = `/nmo/download?timestamp=${timestamp}`;

      // Make a GET request to the Flask server's /nmo/download route
      //const response = await fetch('/nmo/download');
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a URL for the blob data and initiate the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swc_standardized_${timestamp}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);

      // Display a popup window after the download completes
      window.alert('Download completed successfully.');

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownloadConnectClick = async () => {
    try {
      const timestamp = new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }).replace(/[/:,\s]/g, '_');
      const downloadUrl = `/nmo/download_connected?timestamp=${timestamp}`;
      console.log('Download URL:', downloadUrl);

      // Make a GET request to the Flask server's /nmo/download route
      //const response = await fetch('/nmo/download');
      const response = await fetch(downloadUrl);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Blob size:', blob.size);

      // Create a URL for the blob data and initiate the download
      const url = window.URL.createObjectURL(blob);
      console.log('Blob URL:', url);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swc_connected_${timestamp}.zip`;
      document.body.appendChild(a);
      console.log('Anchor tag appended to body');
      a.click();
      console.log('Download initiated');
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Display a popup window after the download completes
      window.alert('Download completed successfully.');
      console.log('Blob URL revoked and anchor tag removed');

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownloadCorrectedTagClick = async () => {
    try {
      const timestamp = new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }).replace(/[/:,\s]/g, '_');
      const downloadUrl = `/nmo/download_corrected_tags?timestamp=${timestamp}`;
      console.log('Download URL:', downloadUrl);

      // Make a GET request to the Flask server's /nmo/download route
      const response = await fetch(downloadUrl);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Blob size:', blob.size);

      // Create a URL for the blob data and initiate the download
      const url = window.URL.createObjectURL(blob);
      console.log('Blob URL:', url);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swc_corrected_tags_${timestamp}.zip`;
      document.body.appendChild(a);
      console.log('Anchor tag appended to body');
      a.click();
      console.log('Download initiated');
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Display a popup window after the download completes
      window.alert('Download completed successfully.');
      console.log('Blob URL revoked and anchor tag removed');

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  const buttonStyle = {
    fontSize: '16px',
    padding: '5px 20px 1px 5px', // top right bottom left
    backgroundColor: '#d3d3d3', // Light gray color
    color: 'green',
    border: '1px solid black',
    cursor: 'pointer', // Add a pointer cursor on hover
    width: '140px',
    marginLeft: '5px',
    marginTop: '20px',
    marginBottom: '5px',
    marginRight: '20px',
  };

  const formStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', 
    marginTop: '20px',
  };

  const verticalAlignStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '10px',
    paddingLeft: '250px',
  };

  return (
    <div align="left">
      <img src={logo} width="700" height="100" alt="swc qc logo" style={{ marginBottom: '10px', marginLeft: '5px', marginTop: '5px' }} />
      <div>
        <form onSubmit={handleSubmit} style={{ ...formStyle, marginBottom: '70px' }}>
          <input
            type="file"
            multiple
            webkitdirectory="true"
            accept=".swc"
            onChange={handleFileChange}
            style={{ color: 'green', width: '220px', fontSize: '16px' }}
          />
          <button
            type="submit"
            style={{ color: 'green', width: '140px', cursor: 'pointer', backgroundColor: '#d3d3d3', fontSize: '16px', border: '1px solid black', marginLeft: '40px' }}
          >
            {isSaving ? 'Saving...' : 'Upload To Server'}
          </button>
        </form>
        <div style={verticalAlignStyle}>
          <div style={{ paddingLeft: '30px' }}>
            <input
              type="checkbox"
              checked={checkLongConnections}
              onChange={(e) => setCheckLongConnections(e.target.checked)}
            />
            <label style={{ marginLeft: '10px' }}>Fix long connections</label>
          </div>
          <div style={{ marginTop: '5px', marginBottom: '1px' }}>
            <label style={{ marginLeft: '60px', marginRight: '10px' }}>Use Stdev X </label>
            <select value={stdevX} onChange={(e) => setStdevX(Number(e.target.value))}>
              {Array.from({ length: 7 }, (_, i) => i + 4).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div> </div>
        <div>
          <button onClick={handleStandardizeClick} style={{ ...buttonStyle, marginRight: '130px' }}>Standardize</button>
          <button onClick={handleAutoConnectClick} style={{ ...buttonStyle, marginRight: '130px' }}>Auto Connect</button>
          <button onClick={handleCorrectTagClick} style={{ ...buttonStyle }}>Correct Tags</button>
        </div>
        <div>
          <button onClick={handleDownloadClick} style={{ ...buttonStyle, marginRight: '130px' }}>
            Download Standardized
          </button>
          <button onClick={handleDownloadConnectClick} style={{ ...buttonStyle, marginRight: '130px' }}>
            Download Connected
          </button>
          <button onClick={handleDownloadCorrectedTagClick} style={{ ...buttonStyle }}>
            Download Corrected Tags
          </button>
        </div>
      </div>
      <div>
        <LogViewer />
      </div>
    </div>
  );
}

export default App;

