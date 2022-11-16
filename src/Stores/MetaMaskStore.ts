import { action, observable, makeObservable, runInAction } from 'mobx';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { reloadBrowser } from '../Utils/reload';
import { configNetList } from '../configNetList';
import { isMobile } from 'react-device-detect';

export enum MetamaskState {
  Initial,
  NotInstalled,
  Installed,
  Connected,
}

class MetaMaskStore {
  @observable state = MetamaskState.Initial;
  @observable currentAccount: Nullable<string> = null;
  @observable provider: Nullable<ethers.providers.Web3Provider> = null;
  @observable chainId: Nullable<string> = null;
  @observable balance: Nullable<string> = null;

  constructor() {
    makeObservable(this);
    this.startApp();
  }

  switchChain = async (id: string) => {
    const dataChain = configNetList.find((i) => i.id === id);
    if (!dataChain || !window.ethereum) {
      return;
    }

    const addChain = async () => {
      return await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: dataChain.id,
            chainName: dataChain.name,
            nativeCurrency: {
              symbol: dataChain.currency,
              decimals: dataChain.decimals,
            },
            rpcUrls: dataChain.rpcUrls,
            blockExplorerUrls: dataChain.blockExplorerUrls,
          },
        ],
      });
    };

    if (isMobile) {
      try {
        return addChain();
      } catch (addError) {
        console.log('Error', addError);
      }
      return;
    }

    try {
      return await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: dataChain.id }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError?.code === 4902) {
        try {
          return addChain();
        } catch (addError) {
          console.log('Error', addError);
        }
      }
      console.log('Error', switchError);
    }
  };

  handleChainChanged = () => {
    // We recommend reloading the page, unless you must do otherwise
    reloadBrowser();
  };

  @action
  handleAccountsChanged = (accounts: any) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      this.setState(MetamaskState.Installed);
      this.currentAccount = null;
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
      this.setState(MetamaskState.Connected);
    }
  };

  @action
  async startApp() {
    const provider = await detectEthereumProvider();
    if (!provider) {
      this.setState(MetamaskState.NotInstalled);
      return;
    }
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
      runInAction(() => {
        this.setState(MetamaskState.Installed);
      });
      return;
    }
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    runInAction(() => {
      this.setChainId(chainId);
    });
    window.ethereum.on('chainChanged', this.handleChainChanged);

    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(this.handleAccountsChanged)
      .catch((err: any) => {
        runInAction(() => {
          this.setState(MetamaskState.Installed);
        });
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
      });
    window.ethereum.on('accountsChanged', this.handleAccountsChanged);
  }

  @action
  setChainId = (chainId: string) => {
    this.chainId = chainId;
  };

  @action
  async connect() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(this.handleAccountsChanged)
      .catch((err: any) => {
        if (err.code === 4001) {
          // Please connect to MetaMask
        } else {
          console.error(err);
          // to do: block button "Click here to connect The Wall with your Metamask"
        }
      });
  }

  @action
  setState = (state: MetamaskState) => {
    this.state = state;
    if (
      state === MetamaskState.Connected ||
      state === MetamaskState.Installed
    ) {
      this.setProvider();
    } else {
      this.setProvider(false);
    }
  };

  @action
  async setProvider(notNull = true) {
    if (!this.currentAccount) return;
    if (this.provider) {
      reloadBrowser();
      // this.provider.removeAllListeners();
    }
    if (notNull) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);

      const filterToAccount = {
        topics: [
          null,
          null,
          null,
          ethers.utils.hexZeroPad(this.currentAccount, 32),
        ],
      };

      const filterFromAccount = {
        topics: [
          null,
          null,
          ethers.utils.hexZeroPad(this.currentAccount, 32),
          null,
        ],
      };

      const toAccount = () => {
        this.setBalance();
      };

      const fromAccount = () => {
        this.setBalance();
      };

      this.provider.on(filterToAccount, toAccount);
      this.provider.on(filterFromAccount, fromAccount);
    } else {
      this.provider = null;
    }
    this.setBalance();
  }

  @action
  setBalance = async () => {
    if (
      this.currentAccount &&
      this.provider &&
      this.state === MetamaskState.Connected
    ) {
      const balance = await this.provider.getBalance(this.currentAccount);
      runInAction(() => {
        this.balance = Number(ethers.utils.formatUnits(balance, 18)).toFixed(4);
      });
    } else {
      this.balance = null;
    }
  };
}

export default MetaMaskStore;
