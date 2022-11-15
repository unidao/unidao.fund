import React from 'react';
import MetaMaskStore from './MetaMaskStore';
import GuruPassMinter from './GuruPassMinter';

export const stores = {
  metaMaskStore: new MetaMaskStore(),
  guruPassMinter: new GuruPassMinter(),
};

export const storesContext = React.createContext(stores);
export const useStores = () => React.useContext(storesContext);
