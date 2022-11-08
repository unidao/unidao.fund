import React from 'react';
import maticImg from '../../../Resources/matic.png';
import s from './SaleCounter.scss';

const SaleCounter = () => {
  const value = '0.500';
  const count = 1;
  return (
    <div className={s.main}>
      <div className={s.coin}>MATIC</div>
      <div className={s.counter}>
        <div className={s.valueCoin}>
          <img src={maticImg} alt="" />
          <span>{value}</span>
        </div>
        <div className={s.control}>
          <div className={s.counterButton}>+</div>
          <p className={s.count}>{count}</p>
          <div className={s.counterButton}>-</div>
        </div>
      </div>
    </div>
  );
};

export default SaleCounter;
