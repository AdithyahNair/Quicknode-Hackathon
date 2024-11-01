import "@rainbow-me/rainbowkit/styles.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MintFormPage from "./pages/MintFormPage";
import MintWithPYUSDPage from "./pages/MintWithPYUSDPage";
import OdosAPIPage from "./pages/OdosAPIPage";
import TransactionAnalyzerPage from "./pages/TransactionAnalyzerPage";
import BetterCausePage from "./pages/BetterCausePage";
import MyAssetsPage from "./pages/MyAssetsPage";
import { wagmiConfig } from "./config";

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Navbar />
            <div className="pt-5">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mint" element={<MintFormPage />} />
                <Route
                  path="/mint-with-pyusd"
                  element={<MintWithPYUSDPage />}
                />
                <Route path="/odos-api" element={<OdosAPIPage />} />
                <Route
                  path="/noves-check"
                  element={<TransactionAnalyzerPage />}
                />
                <Route path="/better-cause" element={<BetterCausePage />} />
                <Route path="/my-assets" element={<MyAssetsPage />} />
              </Routes>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
