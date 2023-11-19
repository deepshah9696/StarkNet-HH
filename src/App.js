/** @format */

import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import HomePage from './Pages/HomePage.tsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePageContents from './Pages/HomePageContents';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { polygonZkEvmTestnet, gnosisChiado, neonDevnet, goerli , optimismGoerli, scrollSepolia, arbitrumSepolia, celoAlfajores,lineaTestnet,mantleTestnet} from 'wagmi/chains';
import Create from './Pages/Preferences';
import SendAssets from './Pages/SendAssets';
import sendNFTs from './Pages/SendAssets';
const projectId = '33ca6721d9a9d08304e2063c7f72596a';
const metadata = {
  name: 'Web3Modal', ksd: "asd"
  
};
const chains = [
  polygonZkEvmTestnet,
  gnosisChiado,
  neonDevnet,
  goerli,
  optimismGoerli,
  scrollSepolia,
  arbitrumSepolia,
  celoAlfajores,
  lineaTestnet,
  mantleTestnet,
];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,

});
createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: 'light' });
// https://youtube.com/shorts/ESfDVsjJKtM?feature=share
function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<HomePage pageContents={HomePageContents} />}
          />
          <Route
            path="/preferences"
            element={<HomePage pageContents={Create} />}
          />
          <Route
            path="/assets"
            element={<HomePage pageContents={sendNFTs} />}
          />
        </Routes>
      </Router>
    </WagmiConfig>
  );
}

export default App;
