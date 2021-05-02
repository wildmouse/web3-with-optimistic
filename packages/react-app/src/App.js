import React from "react";
import { Contract } from "@ethersproject/contracts";
import {getDefaultProvider, JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider();
  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  // const provider = new JsonRpcProvider("https://kovan.optimistic.io" )
  const provider = new JsonRpcProvider("http://127.0.0.1:8545") // optimism url
  // Deployed address on local optimistic network
  const ceaErc20 = new Contract("0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154", abis.erc20, provider);
  // A pre-defined address that owns some CEAERC20 tokens
  // test account address
  const tokenBalance = await ceaErc20.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  console.log({ tokenBalance: tokenBalance.toString() });
}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <Image src={logo} alt="react-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        {/* Remove the "hidden" prop and open the JavaScript console in the browser to see what this function does */}
        <Button onClick={() => readOnChainData()}>
          Read On-Chain Balance
        </Button>
        <Link href="https://ethereum.org/developers/#getting-started" style={{ marginTop: "8px" }}>
          Learn Ethereum
        </Link>
        <Link href="https://reactjs.org">Learn React</Link>
        <Link href="https://thegraph.com/docs/quick-start">Learn The Graph</Link>
      </Body>
    </div>
  );
}

export default App;
