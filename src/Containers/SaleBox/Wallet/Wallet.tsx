import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../Stores/RootStore';
import metamaskImg from '../../../Resources/metamask.png';
import { MetamaskState } from '../../../Stores/MetaMaskStore';
import { configNetList } from '../../../configNetList';
import s from './Wallet.scss';

const Wallet = () => {
  const { metaMaskStore } = useStores();

  let unknownNetwork: null | Boolean = null;
  if (metaMaskStore.chainId) {
    unknownNetwork = !!configNetList.find(
      (i) => i.id === metaMaskStore.chainId
    );
  }

  return (
    <div className={s.main}>
      {metaMaskStore.state === MetamaskState.Initial && (
        <p className={s.note}>Getting MetaMask information...</p>
      )}
      {metaMaskStore.state === MetamaskState.NotInstalled && (
        <a
          href="https://metamask.io/download.html"
          target="_blank"
          className={s.walletButton}
          rel="noreferrer"
        >
          <img src={metamaskImg} alt="" />
          Install MetaMask
        </a>
      )}
      {metaMaskStore.state === MetamaskState.Installed && (
        <>
          <button
            className={s.walletButton}
            onClick={() => metaMaskStore.connect()}
          >
            <img src={metamaskImg} alt="" />
            Connect Wallet
          </button>
          <a href="" className={s.note}>
            I don't have a crypto wallet
          </a>
        </>
      )}
      {metaMaskStore.state === MetamaskState.Connected && (
        <p className={s.note}>MetaMask connected </p>
      )}
      {unknownNetwork === false ? (
        <div className={s.networkSec}>
          <p>Wrong network selected</p>
          {configNetList.map((i) => (
            <button
              onClick={() => metaMaskStore.switchChain(i.id)}
              className={s.chainButton}
            >
              Switch to {i.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default observer(Wallet);
