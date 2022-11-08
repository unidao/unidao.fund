import React from 'react';
import s from './SaleInformation.scss';

const TimeItem = ({ value, name }: { value: string; name: string }) => {
  return (
    <span className={s.timeItem}>
      <b>{value}</b> <span>{name}</span>
    </span>
  );
};

const SaleInformation = () => {
  const tokensLeft = 256;
  const saleEnds = {
    h: '15',
    m: '30',
  };

  return (
    <div className={s.main}>
      <div>
        <div>Tokens left</div>
        <div>
          <b>{tokensLeft}</b>
        </div>
      </div>
      <div>
        <div>Sale ends</div>
        <div>
          <TimeItem value={saleEnds.h} name="h" />
          <TimeItem value={saleEnds.m} name="m" />
        </div>
      </div>
    </div>
  );
};

export default SaleInformation;
