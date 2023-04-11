export const PROD = 'prod';
export const TEST = 'test';
export const POLYGON_TEST_ID = '0x13881';
export const POLYGON_ID = '0x89';

const testData: ChainDataType[] = [
  {
    id: POLYGON_TEST_ID,
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    name: 'Polygon Testnet',
    nameForUrl: 'mumbai',
    currency: 'MATIC',
    decimals: 18,
    scanAddress: 'https://mumbai.polygonscan.com/address',
    guruPassMinterAddress: '0xc6535032560c1eff94ba2e35fcd1b62666adbcc6',
  },
];

const prodData = [
  {
    id: POLYGON_ID,
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
    name: 'Polygon',
    nameForUrl: 'polygon',
    currency: 'MATIC',
    decimals: 18,
    scanAddress: 'https://polygonscan.com/address',
    guruPassMinterAddress: '',
  },
];

export const configNetList =
  process.env.REACT_APP_ENV_APP !== TEST ? prodData : testData;
