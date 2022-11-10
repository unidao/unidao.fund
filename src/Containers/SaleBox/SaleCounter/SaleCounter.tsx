import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../Stores/RootStore';
import maticImg from '../../../Resources/matic.png';
import s from './SaleCounter.scss';

const SaleCounter = () => {
  const { metaMaskStore, guruPassMinter } = useStores();
  const [total, setTotal] = useState<Nullable<string>>();

  const handleClickCount = (value: number) => {
    const result = guruPassMinter.tokensForPurchase + value;
    setCountAndBalance(result);
  };

  const handleInputCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountAndBalance(+e.target.value);
  };

  useEffect(() => {
    if (metaMaskStore.balance && guruPassMinter.tokenPrice) {
      setCountAndBalance(guruPassMinter.tokensForPurchase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaMaskStore.balance, guruPassMinter.tokenPrice]);

  const setCountAndBalance = (value: number) => {
    if (value >= 0 && metaMaskStore.balance && guruPassMinter.tokenPrice) {
      const total = value * guruPassMinter.tokenPrice;
      if (total <= +metaMaskStore.balance) {
        guruPassMinter.setTokensForPurchase(value);
        setTotal(total.toFixed(4));
      } else {
        setCountAndBalance(
          Math.floor(+metaMaskStore.balance / guruPassMinter.tokenPrice)
        );
      }
    }
  };

  return (
    <div className={s.main}>
      <div className={s.coin}>MATIC</div>
      <div className={s.counter}>
        <div className={s.valueCoin}>
          <img src={maticImg} alt="" />
          <span>{total}</span>
        </div>
        <div className={s.control}>
          <button
            className={s.counterButton}
            onClick={() => handleClickCount(-1)}
          >
            -
          </button>
          <input
            className={s.count}
            value={guruPassMinter.tokensForPurchase}
            onChange={handleInputCount}
          />
          <button
            className={s.counterButton}
            onClick={() => handleClickCount(1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(SaleCounter);
