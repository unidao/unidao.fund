import { action, makeObservable, observable, runInAction } from 'mobx';
import { ethers, Contract } from 'ethers';
import { guruPassMinterAbi } from '../Contract/GuruPassMinterAbi';
import { configNetList } from '../configNetList';

const CONTRACT_ADDRESS = configNetList[0].guruPassMinterAddress;

class GuruPassMinter {
  @observable provider: null | ethers.providers.Web3Provider = null;
  @observable contract: Nullable<Contract> = null;
  @observable stageFinishTime: Nullable<number> = null;
  @observable stageSupply: Nullable<number> = null;
  @observable tokenPrice: Nullable<number> = null;
  @observable tokensForPurchase = 1;
  @observable transactionRequest = false;

  constructor() {
    makeObservable(this);
    this.startApp();
  }

  startApp = () => {
    this.getStageFinishTime();
    this.getStageSupply();
    this.getTokenPrice();
  };

  getContract = () => {
    if (this.contract) {
      return this.contract;
    }
    const provider = this.getProvider();
    const contractAddress = CONTRACT_ADDRESS;
    if (!provider || !contractAddress) return null;
    this.contract = new ethers.Contract(
      contractAddress,
      guruPassMinterAbi,
      provider
    );
    return this.contract;
  };

  @action
  getProvider = () => {
    if (this.provider) {
      return this.provider;
    }
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    return this.provider;
  };

  callContractMethod = async (method: string) => {
    const provider = this.getProvider();
    const contract = this.getContract();
    if (!provider || !contract) return;
    try {
      return await contract[method]();
    } catch (e) {
      console.log('Error', e);
    }
  };

  @action
  getStageFinishTime = () => {
    this.callContractMethod('stageFinishTime').then((value) => {
      runInAction(() => {
        this.stageFinishTime = +ethers.utils.formatUnits(value, 0);
      });
    });
  };

  @action
  getStageSupply = () => {
    this.callContractMethod('stageSupply').then((value) => {
      runInAction(() => {
        this.stageSupply = +ethers.utils.formatUnits(value, 0);
      });
    });
  };

  @action
  getTokenPrice = () => {
    this.callContractMethod('tokenPrice').then((value) => {
      runInAction(() => {
        this.tokenPrice = +ethers.utils.formatUnits(value, 18);
      });
    });
  };

  @action
  setTokensForPurchase = (value: number) => {
    this.tokensForPurchase = value;
  };

  @action
  buyTokens = async (from: Nullable<string>) => {
    const to = CONTRACT_ADDRESS;
    const total =
      this.tokensForPurchase && this.tokenPrice
        ? (this.tokensForPurchase * this.tokenPrice).toFixed(6)
        : null;
    if (!window.ethereum || !from || !to || !total) return;
    const value = ethers.utils.parseUnits(total, 18);
    this.transactionRequest = true;
    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to,
            value: value._hex,
          },
        ],
      })
      .then((txHash: any) => {
        console.log(txHash);
        this.transactionRequest = false;
      })
      .catch((error: any) => {
        this.transactionRequest = false;
        console.error(error);
      });
  };
}

export default GuruPassMinter;
