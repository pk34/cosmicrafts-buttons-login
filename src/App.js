import React, { useContext } from 'react';
import './App.css';
import { AppContext } from './context';
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import {StoicIdentity} from "ic-stoic-identity";
import box from "./resources/box.png";
import plug from "./resources/PLUG.png";
import stoic from "./resources/stoic.png";
import earth from "./resources/earth.png";
import identity from "./resources/dfinity.png";

function App() {
  let { walletData, setWalletData } = useContext(AppContext);
    const earthInstall = "https://www.earthwallet.io";
    const whitelist = [
        'onhpa-giaaa-aaaak-qaafa-cai',
        'b7g3n-niaaa-aaaaj-aadlq-cai',
        'e3q2w-lqaaa-aaaai-aazva-cai'
    ];

    const agent = new HttpAgent({
        host: 'https://mainnet.dfinity.network',
    });

    const connectWallet = async (pWallet) => {
        switch(pWallet) {
          case 'stoic':
            loginStoic();
            break;
          case 'plug':
            loginPlug();
            break;
          case 'InternetIdentity':
            loginII();
            break;
          case 'earth':
            loginEarth();
            break;
          default:
        }
    }

    const loginStoic = async () => {
        StoicIdentity.load().then(async identity => {
          if (identity !== false) {
            //ID is a already connected wallet!
          } else {
            identity = await StoicIdentity.connect();
          }
          saveLoggedData(identity.getPrincipal().toString(), "", "Stoic");
        })
    };

    const loginPlug = async () => {
        const isConnected = await window.ic.plug.requestConnect({
            whitelist,
        });
        const principalId = await window.ic.plug.agent.getPrincipal();
        var string = principalId.toString();
        saveLoggedData(string, "", "Plug");
    };

    const loginII = async () => {
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          handleAuthenticated(authClient);
        } else {
          let userII = await authClient.login({
            onSuccess: async () => {
              newAuthII();
            },
          });
        }
    };

    const loginEarth = async () => {
        if(window.earth !== undefined) {
            const address = await window.earth.connect();
            const _am = await window.earth.getAddressMeta();
            saveLoggedData(_am.principalId, "", "Earth");
        } else {
            window.open(earthInstall, "_blank");
        }
    };

    const saveLoggedData = (_w, _u, _c) => {
        let _wallet = {wallet: _w, walletState: "connected", user: _u, walletConnected: _c};
        setWalletData(_wallet);
        localStorage.setItem("cosmic_user", JSON.stringify(_wallet));
    };

    const newAuthII = async () => {
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          handleAuthenticated(authClient);
        }
    };
    
    const handleAuthenticated = async (authClient) => {
        const identity = await authClient.getIdentity();
        saveLoggedData(identity._principal.toString(), "", "InternetIdentity");
    };

    const connecting = () => {
      let _wallet = {wallet: "", walletState: "connecting", user: "", walletConnected: ""};
        setWalletData(_wallet);
        localStorage.setItem("cosmic_user", JSON.stringify(_wallet));
    };

    const logout = () => {
        let _wallet = {wallet: "", walletState: "disconnected", user: "", walletConnected: ""};
        setWalletData(_wallet);
        localStorage.setItem("cosmic_user", JSON.stringify(_wallet));
    }

  const reduceChars = (full) => {
    return full.substring(0,3) + "..." + full.substring(full.lenght-6, 5);
  }

  return (
    <div className="App">
      <header className="App-header">
        <label>
          {
            walletData.walletState === "connected" ? 
            <div className='div-wallet-connected'>
              <label className='txt-wallet' onClick={() => { logout(); }}>Connected&nbsp;{ reduceChars(walletData.wallet) }</label>
            </div>
            : 
            <>
              <div className='div-btn-login' onClick={() => { connecting(); }}>
                <label className='txt-btn-login'>{walletData.walletState === "connecting" ? "Connecting" : "Connect"}</label>
              </div>
              {
                walletData.walletState === "connecting" ?
                <div className='div-wallets-login'>
                  <label className='btn-link' onClick={() => { connectWallet("plug"); }} ><img src={plug} className='img-wallet' />Plug</label>
                  <label className='btn-link' onClick={() => { connectWallet("stoic"); }} ><img src={stoic} className='img-wallet' />Stoic</label>
                  <label className='btn-link' onClick={() => { connectWallet("earth"); }} ><img src={earth} className='img-wallet' />Earth</label>
                  <label className='btn-link' onClick={() => { connectWallet("InternetIdentity"); }} ><img src={identity} className='img-wallet' />Identity</label>
                </div>
                :
                <></>
              }
            </>
          }
        </label>
      </header>
    </div>
  );
}

export default App;
