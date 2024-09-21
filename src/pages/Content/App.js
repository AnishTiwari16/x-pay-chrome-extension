import { JsonRpcProvider, Wallet } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ChatBot from '../../ChatBot/index';
const Modal = ({ onClose }) => {
  const modalRoot = document.body;

  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return ReactDOM.createPortal(
    <ChatBot close={handleBackdropClick} />,
    modalRoot
  );
};

const BeautifulButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      width: '120px',
      height: '40px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      top: '-50px',
      right: '20px',
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = '#45a049';
      e.target.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = '#4CAF50';
      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}
  >
    {children}
  </button>
);

const App = ({ render }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const messageListener = async (message, sender, sendResponse) => {
      if (message.action === 'yourAction') {
        if (message.data.pk) {
          let initialWallet = new Wallet(message.data.pk);
          const provider = new JsonRpcProvider('https://rpc.ankr.com/eth');
          let signer = initialWallet.connect(provider);
          setSigner(signer);
        }
        sendResponse({ result: 'Message received' });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

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
    <div style={{ color: '#fff', position: 'relative' }}>
      {render && (
        <BeautifulButton onClick={openModal}>Bettable</BeautifulButton>
      )}
      Hello from chrome
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
};

export default App;
