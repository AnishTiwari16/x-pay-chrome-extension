import { JsonRpcProvider, Wallet } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ChatBot from '../../ChatBot/index';

const Modal = ({ onClose }) => {
  const modalRoot = document.body;

  // Handle closing the modal when clicking on the backdrop
  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={handleBackdropClick} // Ensure the modal closes when clicking outside the content
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          position: 'relative',
        }}
      >
        <ChatBot close={onClose} />{' '}
        {/* Pass onClose directly to ChatBot for internal close logic */}
      </div>
    </div>,
    modalRoot
  );
};

const BeautifulButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      width: '120px',
      height: '40px',
      backgroundImage:
        'linear-gradient(to right, rgb(162, 255, 3), rgb(0, 240, 255))',
      border: 'none',
      color: 'black',
      borderRadius: '15px',
      fontSize: '16px',
      padding: '8px 20px',
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
      right: '30px',
      gap: '5px',
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
    <svg
      height="16"
      viewBox="0 0 39 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M26.0565 0C19.4393 0 14.0565 5.38286 14.0565 12C14.0565 18.6171 19.4393 24 26.0565 24C32.6736 24 38.0565 18.6171 38.0565 12C38.0565 5.38286 32.6736 0 26.0565 0ZM26.0565 20.5714C21.325 20.5714 17.485 16.7314 17.485 12C17.485 7.26857 21.325 3.42857 26.0565 3.42857C30.7879 3.42857 34.6279 7.26857 34.6279 12C34.6279 16.7314 30.7879 20.5714 26.0565 20.5714ZM9.25648 18.8571H7.88505C7.30219 18.8571 6.85648 18.4114 6.85648 17.8286V6.34284C6.85648 5.75998 7.30219 5.31427 7.88505 5.31427H9.25648C9.83933 5.31427 10.285 5.75998 10.285 6.34284V17.8286C10.285 18.4114 9.83933 18.8571 9.25648 18.8571ZM1.02857 16.4914H2.4C2.98286 16.4914 3.42857 16.0457 3.42857 15.4628V8.57142C3.42857 7.98856 2.98286 7.54285 2.4 7.54285H1.02857C0.445714 7.54285 0 7.98856 0 8.57142V15.4628C0 16.0457 0.445714 16.4914 1.02857 16.4914Z"
        fill="black"
      ></path>
    </svg>
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
        <BeautifulButton onClick={openModal}>Interact</BeautifulButton>
      )}
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
};

export default App;
