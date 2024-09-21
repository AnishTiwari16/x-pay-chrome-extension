import React from 'react';

const Script = ({ fighterName, cid }) => {
  const [loading, setLoading] = React.useState(false);
  const url =
    fighterName === 'Eternal Fire'
      ? 'https://eternalfire.gg/wp-content/uploads/2024/02/eternal-fire-qualified-to-pgl-major-copenhagen-2024.png'
      : fighterName === 'MIBR'
      ? 'https://i.ytimg.com/vi/NQEfKjIgJNw/maxresdefault.jpg'
      : '';

  const placeBet = async () => {
    setLoading(true);
    try {
      const req = await fetch(
        'https://7866-129-126-214-63.ngrasdfasdfok-free.app/api/contracts/txn-data',
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
      console.log(txData);
    } catch (e) {
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
          marginTop: '10px',
          display: 'flex',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
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
