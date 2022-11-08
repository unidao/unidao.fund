import React from 'react';
import MetaMaskStore from './MetaMaskStore';

export const stores = {
  metaMaskStore: new MetaMaskStore(),
};

export const storesContext = React.createContext(stores);
export const useStores = () => React.useContext(storesContext);
