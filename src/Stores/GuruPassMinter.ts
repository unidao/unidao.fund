import { action, makeObservable, observable, runInAction } from 'mobx';
import { ethers, Contract } from 'ethers';
import { guruPassMinterAbi } from '../Contract/GuruPassMinterAbi';

class GuruPassMinter {
  @observable provider: null | ethers.providers.Web3Provider = null;
  @observable contract: Nullable<Contract> = null;
  @observable stageFinishTime: Nullable<number> = null;
  @observable stageSupply: Nullable<number> = null;
  @observable tokenPrice: Nullable<number> = null;

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
    const contractAddress = '0xc6535032560c1eff94ba2e35fcd1b62666adbcc6';
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
}

export default GuruPassMinter;
