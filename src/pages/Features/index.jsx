/* eslint-disable jsx-a11y/alt-text */
import { Box, Link, useMediaQuery } from "@mui/material";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import styled from "styled-components";

function Features() {
  const sm = useMediaQuery("(max-width : 710px)");

  return (
    <StyledContainer>
      <Background />
      <Box display="flex" justifyContent="flex-end" position={"relative"}>
        <Content>
          Introducing the future of OTC token swaps on Ethereum. We’ve integrated dark market pools with lit markets which allows you to achieve unique order types that
          were only on sophisticated markets.
          <ui>
            <li style={{ marginTop: "16px" }}>Access low slippage and private trades for your larger block trades</li>
            <li style={{ marginTop: "16px" }}>Trade using various order types to break down your trades easier</li>
            <li style={{ marginTop: "16px" }}>Execute more trades with our combination of OTC pools and open swap protocols</li>
            <li style={{ marginTop: "16px" }}>Swap privately with trusted counterparties using our secure OTC feature.</li>
          </ui>
        </Content>
      </Box>
    </StyledContainer>
  );
}

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
  width: 60%;
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
  background-image: url("/images/features_back.png");
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

export default Features;
