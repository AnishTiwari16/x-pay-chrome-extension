import { JsonRpcProvider, Wallet } from 'ethers';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const messageListener = async (message, sender, sendResponse) => {
      console.log(message);
      if (message.action === 'yourAction') {
        // Update state with the received message data
        console.log('Message received:', message.data);
        if (message.data.pk) {
          let initialWallet = new Wallet(message.data.pk);
          const provider = new JsonRpcProvider('https://rpc.ankr.com/eth');
          let signer = initialWallet.connect(provider);
          setSigner(signer);
        }
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

  const signMessage = async () => {
    const req = await fetch(
      'https://7866-129-126-214-63.ngrok-free.app/api/contracts/txn-data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '66e6dae092e5dd1952968734', // Contract ID
          functionName: 'increment', // Function to call
          signerAddress: '0xBb0Ad5E4AA60EE7393e7E51B5071B9b7DC5bbd44',
          args: [], // Arguments (if needed for the function)
        }),
      }
    );
    const res = await req.json();
    const txData = res.txData;
    console.log('txData', txData, signer.provider);
    const signedTx = await signer.sendTransaction({
      to: txData.to,
      data: txData.data,
      gasLimit: 3000000,
    });
    console.log('signedTx', signedTx);
    const receipt = await signedTx.wait();
    console.log('receipt', receipt);
  };

  return (
    <div style={{ color: '#fff' }}>
      App
      {signer && (
        <div>
          <h2>Sign Message</h2>
          <button onClick={signMessage}> Sign Message </button>
        </div>
      )}
    </div>
  );
};

export default App;
