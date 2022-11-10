/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { EnvHelper } from "../helpers/Environment";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

/**
 * kept as function to mimic `getMainnetURI()`
 * @returns string
 */
function getTestnetURI() {
  return EnvHelper.alchemyTestnetURI;
}

/**
 * "intelligently" loadbalances production API Keys
 * @returns string
 */
function getMainnetURI() {
  // Shuffles the URIs for "intelligent" loadbalancing
  // return "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  return "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
}

/*
  Types
*/

const Web3Context = React.createContext(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      // eslint-disable-next-line no-useless-concat
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " +
        "please declare it at a higher level."
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

const web3Modal = new Web3Modal({
  network: "testnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          // 1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
          5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        },
        chainID: 5,
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "My Awesome App", // Required
        infuraId: "9aa3d95b3bc440fa88ea12eaa4456161", // Required
        // rpc: "https://mainnet.infura.io/v3/a4d2b749205d4d4197dd52f4f0e17df2", // Optional if `infuraId` is provided; otherwise it's required
        rpc: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 5, // Optional. It defaults to 1 if not provided
        darkMode: true, // Optional. Use dark theme, defaults to false
      },
    },
    "custom-binancechainwallet": {
      display: {
        logo: "/images/binance.png",
        name: "Binance Chain Wallet",
        description: "Connect to your Binance Chain Wallet",
      },
      package: true,
      connector: async () => {
        let provider = null;
        if (typeof window.BinanceChain !== "undefined") {
          provider = window.BinanceChain;
          try {
            await provider.request({ method: "eth_requestAccounts" });
          } catch (error) {
            return { type: "error", title: "Error", detail: "User Rejected" };
          }
        } else {
          return {
            type: "error",
            title: "Error",
            detail: "No Binance Chain Wallet found",
          };
        }
        return provider;
      },
    },
  },
});

export const Web3ContextProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  // NOTE (appleseed): if you are testing on rinkeby you need to set chainId === 4 as the default for non-connected wallet testing...
  // ... you also need to set getTestnetURI() as the default uri state below
  const [chainID, setChainID] = useState(null);
  // const [chainID, setChainID] = useState(1);
  const [address, setAddress] = useState("");

  const [uri, setUri] = useState(getMainnetURI());

  const [provider, setProvider] = useState(new StaticJsonRpcProvider(uri));
  // const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider("https://speedy-nodes-nyc.moralis.io/24036fe0cb35ad4bdc12155f/bsc/testnet"));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasCachedProvider = () => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  // NOTE (appleseed): none of these listeners are needed for Backend API Providers
  // ... so I changed these listeners so that they only apply to walletProviders, eliminating
  // ... polling to the backend providers for network changes
  const _initListeners = useCallback(
    (rawProvider) => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async () => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("chainChanged", async (chain) => {
        _checkNetwork(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork, oldNetwork) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider]
  );

  /**
   * throws an error if networkID is not 1 (mainnet) or 4 (rinkeby)
   */
  const _checkNetwork = (otherChainID) => {
    console.warn("You are switching networks", EnvHelper.getOtherChainID());
    if (
      otherChainID === 20 ||
      otherChainID === 32659 ||
      otherChainID === 4 ||
      otherChainID === 97
    ) {
      console.log(otherChainID);
      setChainID(otherChainID);

      // otherChainID === EnvHelper.getOtherChainID() ? setUri(getMainnetURI()) : setUri(getTestnetURI());
      return true;
    }
    setChainID(otherChainID);
    return false;
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    try {
      const rawProvider = await web3Modal.connect();
      if (rawProvider.type === "error") {
        web3Modal.clearCachedProvider();
        window.localStorage.clear();
        console.log("disconnected");

        setConnected(false);
        setAddress("");
        return rawProvider;
      }
      // await web3Modal.toggleModal();
      // new _initListeners implementation matches Web3Modal Docs
      // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
      _initListeners(rawProvider);
      const connectedProvider = new Web3Provider(rawProvider, "any");

      const chainId = await connectedProvider
        .getNetwork()
        .then((network) => network.chainId);
      const connectedAddress = await connectedProvider.getSigner().getAddress();
      // const validNetwork = _checkNetwork(chainId);
      const validNetwork = true;

      if (!validNetwork) {
        web3Modal.clearCachedProvider();
        window.localStorage.clear();
        console.log("disconnected");

        setConnected(false);
        setAddress("");
        return {
          type: "error",
          title: "Error",
          detail:
            "Wrong network, please switch to Ethereum mainnet or BSC mainnet",
        };
      }
      // Save everything after we've validated the right network.
      // Eventually we'll be fine without doing network validations.
      setAddress(connectedAddress);
      setProvider(connectedProvider);

      // Keep this at the bottom of the method, to ensure any repaints have the data we need
      setConnected(true);

      return connectedProvider;
    } catch (error) {
      console.log(error);
      return "";
    }
  }, [provider, web3Modal, connected, chainID]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    window.localStorage.clear();
    console.log("disconnected");

    setConnected(false);
    setAddress("");
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      web3Modal,
    }),
    [
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      web3Modal,
    ]
  );

  useEffect(() => {
    // logs non-functioning nodes && returns an array of working mainnet nodes, could be used to optimize connection
    // NodeHelper.checkAllNodesStatus();
    if (window.ethereum) {
      window.ethereum.on("networkChanged", function (networkId) {
        _checkNetwork(Number(networkId));
      });
    }
  }, []);

  useEffect(() => {
    fetchChainId();
  }, [connected, window.ethereum]);

  async function fetchChainId() {
    let _provider;
    if (!connected) {
      if (window.ethereum) {
        _provider = new Web3Provider(window.ethereum, "any");
        const id = await _provider.getNetwork();
        _checkNetwork(Number(id.chainId));
      } else _checkNetwork(20);
      // alert(id.chainId + "Not Connected");
    }
    if (connected) {
      _provider = provider;
      const id = await _provider.getNetwork();
      _checkNetwork(Number(id.chainId));
      // alert(id.chainId + "Connected");
    }
    if (!_provider) return;
  }

  return (
    <Web3Context.Provider value={{ onChainProvider }}>
      {children}
    </Web3Context.Provider>
  );
};
