/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import {
  Box,
  Link,
  useMediaQuery,
  Input,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
} from "@mui/material";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import styled from "styled-components";
import {
  AiOutlineDown,
  AiOutlineSwap,
  AiOutlineArrowRight,
} from "react-icons/ai";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Parse from "parse/dist/parse.min.js";
import { BigNumber, ethers, utils } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { useWeb3Context, useAddress } from "../../hooks/web3Context";
import { getTokenContract, getHikariContract } from "../../utils/contracts";

function Orders() {
  const sm = useMediaQuery("(max-width : 710px)");
  const [duration, setDuration] = useState("");
  const [sellToken, setSellToken] = useState(
    "0xA7Aab5027E758Ccc1813C97b36e7Cb475e72671D"
  );
  const [sellAmount, setSellAmount] = useState("");
  const [buyToken, setBuyToken] = useState(
    "0xcB7b1FaD22A2E93040b44b41F66be5797db1d673"
  );
  const [buyAmount, setBuyAmount] = useState("");
  const [counterParty, setCounterParty] = useState("");
  const [expried, setExpried] = useState("");
  const HikariSwap = "0x00d42411b240F71A611f634dec54a6cc42f0e801";
  const [listOrders, setListOrders] = useState([]);
  const [itemId, setItemId] = useState("");

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  const [pending, setPending] = useState(false);

  const account = useAddress();
  const { connect, disconnect, chainID, provider } = useWeb3Context();

  console.log("chainId", chainID);

  const onApproveContract = async (item) => {
    setPending(true);
    console.log(item.get("buyToken"));
    const tokenContract = getTokenContract(
      item.get("buyToken"),
      chainID,
      provider.getSigner()
    );
    const estimateGas = await tokenContract.estimateGas.approve(
      HikariSwap,
      item.get("buyAmount")
    );
    console.log(estimateGas.toString());
    if (estimateGas / 1 === 0) {
      console.log("Insufficient funds");
      // setNotification({
      //   type: "error",
      //   title: "Error",
      //   detail: "Insufficient funds",
      // });
      setPending(false);
      return;
    }
    const tx = {
      gasLimit: estimateGas.toString(),
    };
    const approvetx = await tokenContract.approve(
      HikariSwap,
      item.get("buyAmount"),
      tx
    );
    await approvetx.wait();
    setPending(false);
  };

  const onMakeOffer = async () => {
    setPending(true);
    const hikariContract = getHikariContract(chainID, provider.getSigner());
    const estimateGas = await hikariContract.estimateGas.makeOffer(
      sellToken,
      ethers.utils.parseEther(sellAmount),
      buyToken,
      ethers.utils.parseEther(buyAmount)
    );
    console.log(estimateGas.toString());
    if (estimateGas / 1 === 0) {
      console.log("Insufficient funds");
      // setNotification({
      //   type: "error",
      //   title: "Error",
      //   detail: "Insufficient funds",
      // });
      setPending(false);
      return;
    }
    const tx = {
      gasLimit: estimateGas.toString(),
    };
    const approvetx = await hikariContract.makeOffer(
      sellToken,
      ethers.utils.parseEther(sellAmount),
      buyToken,
      ethers.utils.parseEther(buyAmount),
      tx
    );
    await approvetx.wait();
    setPending(false);
  };

  const onAcceptOffer = async (item) => {
    console.log(item.get("orderId"));
    setPending(true);
    const hikariContract = getHikariContract(chainID, provider.getSigner());
    const estimateGas = await hikariContract.estimateGas.pay(
      item.get("orderId")
    );
    console.log(estimateGas.toString());
    if (estimateGas / 1 === 0) {
      console.log("Insufficient funds");
      // setNotification({
      //   type: "error",
      //   title: "Error",
      //   detail: "Insufficient funds",
      // });
      setPending(false);
      return;
    }
    const tx = {
      gasLimit: estimateGas.toString(),
    };
    const approvetx = await hikariContract.pay(item.get("orderId"), tx);
    await approvetx.wait();
    setPending(false);
  };

  const CreateOrder = async () => {
    try {
      if (!account) connect();

      const HikariContract = getHikariContract(chainID);

      await onApproveContract(sellToken);
      await onMakeOffer();

      // create a new Parse Object instance
      const orderId = await HikariContract.offerCount();
      console.log(orderId);

      const Order = new Parse.Object("Order");
      // define the attributes you want for your Object
      Order.set("orderId", orderId);
      Order.set("sellToken", sellToken);
      Order.set("sellAmount", ethers.utils.parseEther(sellAmount));
      Order.set("buyToken", buyToken);
      Order.set("buyAmount", ethers.utils.parseEther(buyAmount));
      Order.set("counterParty", counterParty);
      Order.set("expried", expried * duration);
      Order.set("isPaid", false);
      // save it on Back4App Data Store
      await Order.save();
      console.log("Order saved");
    } catch (error) {
      console.log("Error saving new person: ", error);
    }
  };

  const UpdateOrderList = async (id) => {
    let order = new Parse.Object("Order");
    order.set("id", id);
    order.set("isPaid", true);
    await order.save();
    console.log("order updated successfully");
    await FetchOrders();
  };

  const AcceptOffer = async (id) => {
    if (!account) await connect();
    setPending(true);
    setItemId(id);
    const query = new Parse.Query("Order");
    // use the equalTo filter to look for user which the name is John. this filter can be used in any data type
    try {
      let result = await query.get(id);
      console.log(result);
      await onApproveContract(result);
      console.log("aprpvoed");
      await onAcceptOffer(result);
      console.log("call pay function");
      await UpdateOrderList(id);
      console.log("updated order list");
      setPending(false);
    } catch (error) {
      console.log("error: ", error);
    }
    setPending(false);
  };

  const getAccountString = (address) => {
    const account = getAddress(address);
    const len = account.length;
    return `0x${account.substr(2, 4)}...${account.substr(len - 4, len - 1)}`;
  };

  useEffect(() => {
    FetchOrders();
  }, []);

  const FetchOrders = async () => {
    // create your Parse Query using the Person Class you've created
    const query = new Parse.Query("Order");
    // use the equalTo filter to look for user which the name is John. this filter can be used in any data type
    try {
      let results = await query.find();
      console.log(results);
      setListOrders(results);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  console.log("listOrders", listOrders.length);

  const formatBalance = (balance) => {
    return utils.formatEther(BigNumber.from(balance));
  };

  return (
    <StyledContainer>
      <Background />
      <Box position={"relative"}>
        <TradeBox>
          <TradeHead>Order List</TradeHead>
          <table id="orders">
            <thead>
              <tr>
                <th>OrderId</th>
                <th>SellToken Address</th>
                <th>SellToken Amount</th>
                <th>BuyToken Address</th>
                <th>BuyToken Amount</th>
                {/* <th>Counterparty Address</th>
                <th>Expried In</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listOrders !== null &&
                listOrders !== undefined &&
                listOrders.length > 0 &&
                listOrders.map((item, index) => {
                  return (
                    !item.get("isPaid") && (
                      <tr key={index}>
                        <td>
                          {BigNumber.from(item.get("orderId")).toNumber()}
                        </td>
                        <td>{getAccountString(item.get("sellToken"))}</td>
                        <td>{formatBalance(item.get("sellAmount"))}</td>
                        <td>{getAccountString(item.get("buyToken"))}</td>
                        <td>{formatBalance(item.get("buyAmount"))}</td>
                        {/* <td>{getAccountString(item.get("counterParty"))}</td> */}
                        {/* <td>{item.get("expried")}</td> */}
                        <td>
                          {itemId === item.id && pending ? (
                            <AcceptBtn
                              pending={pending}
                              onClick={() => !pending && AcceptOffer(item.id)}
                            >
                              Accept
                              <CircularProgress
                                size={24}
                                sx={{
                                  color: "#f00",
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  marginTop: "-12px",
                                  marginLeft: "-12px",
                                }}
                              />
                            </AcceptBtn>
                          ) : (
                            <AcceptBtn
                              pending={pending}
                              onClick={() => !pending && AcceptOffer(item.id)}
                            >
                              Accept
                            </AcceptBtn>
                          )}
                        </td>
                      </tr>
                    )
                  );
                })}
            </tbody>
          </table>
        </TradeBox>
      </Box>
    </StyledContainer>
  );
}

const AcceptBtn = styled(Box)`
  font-size: 15px;
  line-height: 18px;
  background-color: ${({ pending }) => (!pending ? "#04AA6D" : "gray")};
  color: white;
  padding: 8px;
  position: relative;
  cursor: ${({ pending }) => (!pending ? "pointer" : "not-allowed")};
  :hover {
    background-color: ${({ pending }) =>
      !pending ? "rgb(43, 113, 255)" : "gray"};
  }
`;

const CreateBtn = styled(Box)`
  opacity: 0.75;
  border: 1px solid #30252f;
  border-radius: 28px;
  padding: 12px 28px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;

  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${({ pending }) => (!pending ? "pointer" : "not-allowed")};
  position: relative;
  :hover {
    background-color: rgb(75, 198, 139);
    color: white;
  }
  transition: all 0.5s ease-out;
`;
const TokenSymbol = styled(Box)``;
const TokenSmallName = styled(Box)`
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;

  color: #000000;
`;
const TokenName = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 36px;

  color: #000000;
  cursor: pointer;
`;

const TradeDesc = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 27px;
  text-align: center;

  color: #000000;
`;

const TradeText = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 27px;
  text-align: center;

  color: #000000;
  margin-top: 24px;
`;

const TradeHead = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 45px;
  line-height: 54px;
  text-align: center;

  color: #000000;
`;
const TradeBox = styled(Box)`
  background: #fffcf1;
  opacity: 0.92;
  border: 1px solid #000000;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 37px;
  padding: 60px;
  width: fit-content;
  margin: auto;
`;
const LaunchApp = styled(Box)`
  margin: 45px 0 0 0;
  width: 200px;
  height: 64px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 23px;
  line-height: 120%;

  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                        supported by Chrome, Edge, Opera and Firefox */

  border: 1px solid #30252f;
  border-radius: 27px;

  display: flex;
  justify-content: center;
  align-items: center;
  :hover:not(:disabled) {
    background-color: rgb(43, 113, 255);
  }
  transition: background-color 0.5s ease-out;

  @media screen and (max-width: 720px) {
    width: 120px;
    height: 48px;
    font-size: 16px;
    margin-top: 35px;
  }
`;

const RowContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const Socials = styled(Link)`
  margin: 0 37px 0 0 !important;
  text-decoration: none;
  font-size: 30px;
  color: black !important;
`;

const Title = styled(Box)`
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 96px;
  line-height: 130%;
  color: #000000;
  display: flex;

  @media screen and (max-width: 710px) {
    /* flex-direction: column; */
    font-size: 64px;
  }
  @media screen and (max-width: 475px) {
    font-size: 48px;
  }
`;

const Content = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 25px;
  line-height: 120%;
  width: 50%;
  color: #000000;
  margin: 0 0 45px 0;
  @media screen and (max-width: 1000px) {
    width: 80%;
  }
  @media screen and (max-width: 900px) {
    width: 85%;
    font-size: 20px;
  }
  @media screen and (max-width: 710px) {
    width: 90%;
    font-size: 16px;
    margin-top: 36px;
  }
`;

const StyledContainer = styled(Box)`
  padding: 270px 70px 70px 70px;
  width: 100vw;
  min-height: 100vh;

  @media screen and (max-width: 710px) {
    padding: 140px 40px 70px 40px;
  }
  position: relative;
`;

const Background = styled(Box)`
  background-image: url("/images/trade_back.png");
  background-repeat: no-repeat;
  background-size: 1728px 100%;
  background-position-x: 60%; //auto 100vh;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 1177px;
  @media screen and (min-width: 1728px) {
    background-size: 100% 100%;
    height: calc(100vw / 1728 * 1177);
  }

  @media screen and (max-width: 900px) {
    background-size: 1296px 75%;
    background-position-y: 250px;
    height: 100vh;
  }

  @media screen and (max-width: 700px) {
    background-size: 864px 50%;
    background-position-y: 300px;
    height: 100vh;
  }
`;

export default Orders;
