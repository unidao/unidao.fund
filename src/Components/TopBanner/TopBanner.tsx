import React from 'react';
import leftImg from '../../Resources/punk_b1.png';
import rightImg from '../../Resources/punk_b2.png';
import s from './TopBanner.scss';

const TopBanner = () => {
  return (
    <div className={s.main}>
      <div className={s.content}>
        <img src={leftImg} alt="" />
        <div className={s.text}>
          <h2 className={s.title}>GURU & Fusion Punks</h2>
          The first limited edition collection from guru collective
        </div>
        <img src={rightImg} alt="" />
      </div>
    </div>
  );
};

export default TopBanner;
