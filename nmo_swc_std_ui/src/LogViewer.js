import React, { useEffect, useState } from 'react';
import './App.css';

function LogViewer() {
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
        // Function to fetch file content
        const fetchFileContent = async () => {
            try {
                // Clear the file content
                //setFileContent('');

                const response = await fetch('/nmo/readfile');
                if (!response.ok) {
                    throw new Error('Failed to fetch file');
                }
                const content = await response.text();
                setFileContent(content);
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        };

        // Fetch file content initially when the component mounts
        fetchFileContent();

        // Set up an interval to fetch file content every 5 seconds (adjust as needed)
        const refreshInterval = setInterval(() => {
            fetchFileContent();
        }, 500);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    // Clear the fileContent state when the user refreshes the page
    window.onbeforeunload = () => {
       setFileContent('');
    };

    // Clear the log when the page is refreshed
    window.onbeforeunload = () => {
    fetch('/nmo/clearlog', { method: 'POST' })
      .then((response) => {
        if (response.status === 200) {
          console.log('Log cleared successfully');
        } else {
          console.error('Failed to clear log');
        }
      })
      .catch((error) => {
        console.error('Error clearing log:', error);
      });
    };

    return (
        <div  style={{
         overflowY: 'auto',
         overflowX: 'hidden',
         marginRight: '10px',
         maxHeight: '450px',
         maxWidth: '750px' }}
        >
            <h1 style={{ marginLeft: '5px' }}> SWC Standardization Status </h1>
            <pre className="large-font">{fileContent}</pre>
        </div>
    );
}

export default LogViewer;

