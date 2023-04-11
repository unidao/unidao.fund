import React from 'react';
import TopBanner from '../../Components/TopBanner/TopBanner';
import SaleBox from '../SaleBox/SaleBox';
import s from './App.scss';

const App = () => {
  return (
    <div>
      <TopBanner />
      <div className={s.saleSection}>
        <SaleBox />
      </div>
    </div>
  );
};

export default App;
