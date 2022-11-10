import { action, makeObservable, observable } from 'mobx';
import { ethers, Contract } from 'ethers';
import { guruPassMinterAbi } from '../Contract/GuruPassMinterAbi';

class GuruPassMinter {
  @observable provider: null | ethers.providers.Web3Provider = null;
  @observable contract: Nullable<Contract> = null;
  @observable stageFinishTime: Nullable<number> = null;

  constructor() {
    makeObservable(this);
    this.startApp();
  }

  startApp = () => {
    this.getStageFinishTime();
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

  @action
  getStageFinishTime = async () => {
    const provider = this.getProvider();
    const contract = this.getContract();
    if (!provider || !contract) return;
    try {
      const value = await contract.stageFinishTime();
      this.stageFinishTime = +ethers.utils.formatUnits(value, 0);
    } catch (e) {
      console.log('Error', e);
    }
  };
}

export default GuruPassMinter;
