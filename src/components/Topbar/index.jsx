/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import Hamburger from "./Hamburger";
import { Link } from "react-router-dom";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";

function Topbar() {
  const md = useMediaQuery("(max-width: 1100px)");
  const sm = useMediaQuery("(max-width: 710px)");
  const [page, setPage] = useState("home");
  const account = useAddress();
  const { connect, disconnect } = useWeb3Context();
  console.log(account);

  useEffect(() => {
    setPage(window.location.href.slice(window.location.href.lastIndexOf("/") + 1));
  }, []);

  const connectWallet = () => {
    connect().then((msg) => {
      console.log(msg);
    });
  };

  const disconnectWallet = () => {
    disconnect().then((msg) => {
      console.log(msg);
    });
  };

  const getAccountString = (address) => {
    const account = address;
    const len = account.length;
    return `0x${account.substr(2, 4)}...${account.substr(len - 4, len - 1)}`;
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        // addAccount({ id: accounts[0] })
        connectWallet();
      });
      window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    }
  }, [account]);

  return (
    <StyledContainer>
      <RowContainer>
        <RowContainer>
          <Logo>
            <img src="/images/logo.png"></img>
          </Logo>
          {md ? (
            ""
          ) : (
            <RowContainer>
              <GLink>
                <Link to="/" style={{ textDecoration: "none", color: page === "home" ? "#0093C1" : "black" }} onClick={() => setPage("home")}>
                  Home
                </Link>
              </GLink>
              <GLink>
                <Link to="/features" style={{ textDecoration: "none", color: page === "features" ? "#0093C1" : "black" }} onClick={() => setPage("features")}>
                  Features
                </Link>
              </GLink>
              <GLink>
                <Link to="/partnerships" style={{ textDecoration: "none", color: page === "partnerships" ? "#0093C1" : "black" }} onClick={() => setPage("partnerships")}>
                  Partnerships
                </Link>
              </GLink>
              <GLink>
                <Link to="/trade" style={{ textDecoration: "none", color: page === "trade" ? "#0093C1" : "black" }} onClick={() => setPage("trade")}>
                  Trade
                </Link>
              </GLink>
              <GLink>
                <Link to="/orders" style={{ textDecoration: "none", color: page === "orders" ? "#0093C1" : "black" }} onClick={() => setPage("orders")}>
                  Orders
                </Link>
              </GLink>
            </RowContainer>
          )}
        </RowContainer>
        <RowContainer>
          {md ? (
            <Hamburger />
          ) : (
            <RowContainer>
              <GLink>
                <Link to="/faq" style={{ textDecoration: "none", color: page === "faq" ? "#0093C1" : "black" }} onClick={() => setPage("faq")}>
                  FAQ
                </Link>
              </GLink>
              <ConnectButton onClick={() => (account ? disconnectWallet() : connectWallet())}>{account ? getAccountString(account) : "Connect"}</ConnectButton>
            </RowContainer>
          )}
        </RowContainer>
      </RowContainer>
    </StyledContainer>
  );
}

const StyledContainer = styled(Box)`
  position: absolute;
  width: 100%;
  padding: 50px 70px 50px 50px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 23px;
  line-height: 120%;
  color: black;
  z-index: 100;
`;

const RowContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Logo = styled(Box)`
  margin-right: 55px;
  width: 58px;
  height: 58px;
  @media screen and (max-width: 500px) {
    margin-right: 20px;
  }
`;

const GLink = styled(Box)`
  margin: 20px 0 0 0 !important;
  padding-right: 55px;
  text-decoration: none !important;
  color: black !important;
  @media screen and (max-width: 500px) {
    padding-right: 20px;
  }
`;

const ConnectButton = styled(Box)`
  width: 172px;
  height: 63px;
  border: 1px solid #30252f;
  border-radius: 27px;

  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                        supported by Chrome, Edge, Opera and Firefox */

  display: flex;
  align-items: center;
  justify-content: center;
  //border: none;
  //background-color: rgba(43, 113, 255, 0.1);
  //color: rgba(43, 113, 255, 1);
  :hover:not(:disabled) {
    background-color: rgb(75, 198, 139);
    color: white;
  }
  transition: all 0.5s ease-out;
`;
export default Topbar;
