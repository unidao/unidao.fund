import React from 'react';
import SaleCounter from './SaleCounter/SaleCounter';
import SaleDescription from './SaleDescription/SaleDescription';
import SaleInformation from './SaleInformation/SaleInformation';
import Wallet from './Wallet/Wallet';
import s from './SaleBox.scss';

const SaleBox = () => {
  return (
    <div className={s.main}>
      <SaleInformation />
      <SaleDescription />
      <SaleCounter />
      <Wallet />
    </div>
  );
};

export default SaleBox;
