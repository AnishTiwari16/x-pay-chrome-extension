import React, { useEffect, useState } from 'react';

const App = () => {
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      console.log(message);
      if (message.action === 'yourAction') {
        // Update state with the received message data
        setMessageData(message.data);
        console.log('Message received:', message.data);

        // Send a response back to the sender
        sendResponse({ result: 'Message received' });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup function
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <div style={{ color: '#fff' }}>
      App
      {messageData && (
        <div>
          <h2>Received Message Data:</h2>
          <pre>{JSON.stringify(messageData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
