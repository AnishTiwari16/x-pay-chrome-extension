/// <reference types="chrome"/>
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import React, { useEffect, useState } from 'react';
import './Popup.css';
import RPC from './webRPC'; // for using web3.js
const clientId =
  'BMOrKGsNSuifb5MOhmMmJOrkptD_vHNpAJ54OIV684-T1BQ5ccoz4JMF6W8bkIlnw5_qaFOEDwNBVhpAwUGClQ4';

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);

  const sendMessageToContentScript = () => {
    // Get the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        // Send a message to the content script in the active tab
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'yourAction', data: 'yourData' },
          (response) => {
            console.log(response);
          }
        );
      }
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0xafa',
          rpcTarget: 'https://rpc-holesky.morphl2.io',
          displayName: 'Morph Holesky',
          blockExplorerUrl: 'https://explorer-holesky.morphl2.io',
          ticker: 'ETH',
          tickerName: 'Ethereum',
          logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3auth = new Web3AuthNoModal({
          clientId, // get from https://dashboard.web3auth.io
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        const openloginAdapter = new OpenloginAdapter({});
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);
        sendMessageToContentScript();
        await web3auth.init();
        const provider = web3auth.provider;
        setProvider(provider);
        if (web3auth.connected) {
          const rpc = new RPC(provider);
          const privateKey = await rpc.getPrivateKey();
          console.log(privateKey, 'prie', rpc);
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              // Send a message to the content script in the active tab
              chrome.tabs.sendMessage(
                tabs[0].id,
                {
                  action: 'yourAction',
                  data: { pk: privateKey },
                },
                (response) => {
                  console.log(response);
                }
              );
            }
          });
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();

    if (window.innerWidth > 400) setIsFullPage(true);
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: 'google',
      }
    );
    setProvider(web3authProvider);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  function uiConsole(...args) {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        {/* <div>
					<button onClick={getPrivateKey} className='card'>
						Get Private Key
					</button>
				</div> */}
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: 'pre-line' }}>
        <p style={{ whiteSpace: 'pre-line' }}>Login Successful</p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      {!isFullPage ? (
        <button
          onClick={() => chrome.tabs.create({ url: 'popup.html' })}
          className="card login"
        >
          Login
        </button>
      ) : (
        <button onClick={login} className="card login">
          Login
        </button>
      )}
    </>
  );

  return (
    <div className="container">
      <h1 className="title">Agent X Extension</h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/chrome-extension-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
