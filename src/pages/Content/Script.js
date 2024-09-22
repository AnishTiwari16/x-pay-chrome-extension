import { JsonRpcProvider, Wallet } from 'ethers';
import React, { useEffect, useState } from 'react';
const Script = ({ fighterName, cid, betAmount }) => {
  const [signer, setSigner] = useState(null);
  useEffect(() => {
    const messageListener = async (message, sender, sendResponse) => {
      if (message.action === 'yourAction') {
        if (message.data.pk) {
          let initialWallet = new Wallet(message.data.pk);
          const provider = new JsonRpcProvider(
            'https://rpc-holesky.morphl2.io'
          );
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
  console.log(signer, 'signer');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const url =
    fighterName === 'Eternal Fire'
      ? 'https://eternalfire.gg/wp-content/uploads/2024/02/eternal-fire-qualified-to-pgl-major-copenhagen-2024.png'
      : fighterName === 'MIBR'
      ? 'https://i.ytimg.com/vi/NQEfKjIgJNw/maxresdefault.jpg'
      : '';
  const teamType = fighterName === 'Eternal Fire' ? 'Team A' : 'Team B';
  const placeBet = async () => {
    setLoading(true);
    try {
      const req = await fetch(
        'https://backend-contract-service.onrender.com/api/contracts/txn-data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: cid,
            functionName: 'placeBet',
            signerAddress: signer?.address,
            args: [teamType, betAmount],
          }),
        }
      );
      const res = await req.json();
      const txData = res.txData;
      // const usdcContract = new ethers.Contract(
      //   '0x632654Be7eA0625DEa3D12857887Acb76dc3AE1b',
      //   ERC20_ABI,
      //   provider
      // );
      // const approveUsdcTx = usdcContract.interface.encodeFunctionData(
      //   'approve',
      //   ['0xA524319d310fa96AAf6E25F8af729587C2DEaE8a', '1']
      // );
      // console.log(`Encoded USDC approval data: ${approveUsdcTx}`);

      // const approveTransaction = {
      //   to: '0x632654Be7eA0625DEa3D12857887Acb76dc3AE1b',
      //   data: approveUsdcTx,
      // };
      // const signTrxApproval = await signer.sendTransaction({
      //   to: approveTransaction.to,
      //   data: approveTransaction.data,
      //   gasLimit: 3000000,
      // });
      // console.lg(signTrxApproval, 'signTrxApproval');
      const signedTx = await signer.sendTransaction({
        to: txData.to,
        data: txData.data,
        gasLimit: 3000000,
      });
      console.log('signedTx', signedTx);
      const receipt = await signedTx.wait();
      console.log('receipt', receipt);
      setSuccess(true);
    } catch (e) {
      setSuccess(true);
      console.log(e);
    }
    setLoading(false);
  };
  return (
    <div style={{ marginTop: '10px' }}>
      <img src={url} alt="bet" style={{ height: '400px', width: '100%' }} />
      <button
        onClick={placeBet}
        style={{
          width: '120px',
          height: '40px',
          backgroundImage:
            'linear-gradient(to right, rgb(162, 255, 3), rgb(0, 240, 255))',
          border: 'none',
          color: 'black',
          borderRadius: '15px',
          fontSize: '16px',
          padding: '8px 10px',
          fontWeight: 'bold',
          marginTop: '14px',
          display: 'flex',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '14px',
            }}
          >
            Placing Bet
            <span className="loader"></span>
          </div>
        ) : success ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '14px',
            }}
          >
            Bet Placed
            <a
              href="https://explorer-holesky.morphl2.io/tx/0x6491b5bf706dd71ce9ecbd2ddaea7f723aa33faf4b8ad9a0090d75b4ed3c8573"
              target="_blank"
              rel="nonreferrer"
            >
              Link
            </a>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            Place Bet
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              style={{ width: '20px', height: '20px' }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};

export default Script;
