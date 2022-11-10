/* eslint-disable jsx-a11y/alt-text */
import { Box, Link, useMediaQuery } from "@mui/material";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import styled from "styled-components";

function Home() {
  const sm = useMediaQuery("(max-width : 710px)");

  return (
    <StyledContainer>
      <Background />
      <Box position={"relative"}>
        <Title>
          HIKARI{!sm ? <div>&nbsp;</div> : ""}
          <Box fontWeight={"700"}>SWAP</Box>
        </Title>
        <Content>
          Trade with HikariSwap and access our OTC Pools. We integrate dark
          pools with lit markets to give you deep liquidity on your tokens.
        </Content>
        <RowContainer>
          {[
            { linkto: "https://t.me/#", icon: <FaTelegramPlane /> },
            { linkto: "https://twitter.com/#", icon: <FaTwitter /> },
            { linkto: "https://dex.com/#", icon: <img src="/images/dex.png" style={{height: "35px", width: "35px"}}></img> },
            { linkto: "https://coinmarket.com/#", icon: <img src="/images/coinmarket.png"></img> },
          ].map((social, index) => {
            return (
              <Socials href={social.linkto} target={"_blank"}>
                {social.icon}
              </Socials>
            );
          })}
        </RowContainer>
        <LaunchApp onClick={() => window.open("https://hikari-swap.vercel.app/")}>Launch App</LaunchApp>
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

  @media screen  and (max-width: 720px) {
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
  background-image: url("/images/home_back.png");
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

export default Home;
