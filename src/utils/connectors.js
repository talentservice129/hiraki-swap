import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 5],
});

export const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
  appName: "HIKARI",
  supportedChainIds: [1, 5],
});

export const WalletConnect = new WalletConnectConnector({
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  supportedChainIds: [1, 5],
});

export const switchNetwork = async (network, statu = false) => {
  try {
    const provider = window;
    if (provider.ethereum) {
      const chainId = await provider.ethereum.request({
        method: "eth_chainId",
      });
      let ChainId = "0x1";
      if (network === "ethereum") {
        ChainId = "0x1";
      } else if (network === "binance") {
        // BSC Test 97
        // ChainId = '0x61';
        // BSC Main 56
        ChainId = "0x38";
      }
      if (chainId === ChainId) return;
      try {
        await provider.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ChainId }],
        });
      } catch (switchError) {
        console.log(switchError);
      }
    } else {
      window.open("https://metamask.io/download/");
    }
  } catch (error) {
    console.log(error);
  }
};
