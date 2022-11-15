import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../Stores/RootStore';
import { getCurTimestamp } from '../../../Utils/timeUtilities';
import s from './SaleInformation.scss';
import { MetamaskState } from '../../../Stores/MetaMaskStore';

const TimeItem = ({ value, name }: { value: number; name: string }) => {
  return (
    <span className={s.timeItem}>
      <b>{value < 10 ? `0${value}` : value}</b> <span>{name}</span>
    </span>
  );
};

interface TimeObj {
  h: number;
  m: number;
  s: number;
}

const SaleInformation = () => {
  const { metaMaskStore, guruPassMinter } = useStores();
  const [saleEnds, setSaleEnds] = useState<Nullable<TimeObj>>(null);
  const [sale, setSale] = useState<Nullable<boolean>>(null);

  const callSetSaleEnds = (timeLeft: number) => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft / 60) % 60);
    const s = timeLeft % 60;
    setSaleEnds({ h, m, s });
  };

  useEffect(() => {
    const finishTime = guruPassMinter.stageFinishTime;
    if (!finishTime) return;
    const timeLeft = finishTime - getCurTimestamp();
    if (timeLeft < 0) {
      setSale(false);
      return;
    }
    callSetSaleEnds(timeLeft);
    let interval = setInterval(() => {
      const timeLeft = finishTime - getCurTimestamp();
      if (timeLeft < 0) {
        clearInterval(interval);
        setSale(false);
        return;
      }
      callSetSaleEnds(timeLeft);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [guruPassMinter.stageFinishTime]);

  if (
    metaMaskStore.state === MetamaskState.Initial ||
    metaMaskStore.state === MetamaskState.NotInstalled
  ) {
    return null;
  }

  if (sale === false) {
    return <div className={s.address}>{metaMaskStore.currentAccount}</div>;
  }

  return (
    <div className={s.main}>
      <div>
        <div>Tokens left</div>
        <div>
          <b>{guruPassMinter.stageSupply}</b>
        </div>
      </div>
      <div>
        {saleEnds && (
          <>
            <div>Sale ends</div>
            <div>
              <TimeItem value={saleEnds.h} name="h" />
              <TimeItem value={saleEnds.m} name="m" />
              <TimeItem value={saleEnds.s} name="s" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(SaleInformation);
