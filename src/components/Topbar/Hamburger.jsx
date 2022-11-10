/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./menu.css";
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";

const Hamburger = ({ setNotification, curpage, setCurPage }) => {
  const menuRef = useRef(null);
  const [active, setActive] = useState(1);

  const menus = [
    { url: "home.png", text: "Home", link: "" },
    { url: "features.png", text: "Features", link: "features" },
    { url: "partnerships.png", text: "Partnerships", link: "partnerships" },
    { url: "trade.png", text: "Trade", link: "trade" },
    { url: "orders.png", text: "Orders", link: "orders" },
    { url: "faq.png", text: "FAQ", link: "faq" },
  ];

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        let form = document.getElementById("check");
        if (form) form.checked = false;
      }
    });
  }, []);

  const sm = useMediaQuery("(max-height : 490px)");
  return (
    <nav role="navigation" style={{ zIndex: "1" }}>
      <div id="menuToggle" ref={menuRef}>
        {/* A fake / hidden checkbox is used as click reciever,
    so you can use the :checked selector on it. */}

        <input type="checkbox" id="check" />

        {/* Some spans to act as a hamburger.
    
    They are acting like a real hamburger,
    not that McDonalds stuff. */}

        <span></span>
        <span></span>
        <span></span>

        {/* Too bad the menu has to be inside of the button but hey, it's pure CSS magic. */}

        <Menu id="menu">
          <Box display={"flex"} justifyContent={"space-between"} width={"100%"} zIndex={15} mt={"30px"} ml={"24px"}>
            <Logo>
              <img src="/images/logo.png"></img>
            </Logo>
          </Box>
          <ItemPanel mx={"20px"} mt={"52px"} active={active}>
            {menus.map((data, i) => {
              return (
                <Link
                  to={`/${data.link}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    setActive(i + 1);
                    let form = document.getElementById("check");
                    if (form) form.checked = false;
                  }}
                >
                  <Item>
                    {/*<Icon zIndex={10} ml={i === 4 ? "10px" : 0}>
                      <img src={`/icons/${data.url}`} />
                    </Icon>*/}
                    <Box ml={i === 111 ? "-10px" : 0} color={"black"} fontSize={"23px"} fontFamily={"Inter"} zIndex={10}>
                      {data.text}
                    </Box>
                  </Item>
                </Link>
              );
            })}

            <ConnectButton
              onClick={() => {
                let form = document.getElementById("check");
                if (form) form.checked = false;
              }}
            >
              Connect
            </ConnectButton>
          </ItemPanel>
        </Menu>
      </div>
    </nav>
  );
};
const Logo = styled(Box)`
  margin-right: 55px;
  padding: 25px;
  width: 58px;
  height: 58px;
  @media screen and (max-width: 500px) {
    margin-right: 20px;
  }
`;
const ConnectButton = styled(Box)`
  width: 172px;
  height: 63px;
  border: 1px solid #30252f;
  border-radius: 27px;
  margin-left: 58px;

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
  border: none;
  background-color: rgba(43, 113, 255, 0.1);
  color: rgba(43, 113, 255, 1);
  :hover:not(:disabled) {
    background-color: rgb(75, 198, 139);
    color: white;
  }
  transition: all 0.5s ease-out;
`;

const ItemPanel = styled(Box)`
  > a:nth-child(${({ active }) => active}) > div {
    background-color: #d8cead;
  }
`;

const Item = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 12px 0 12px 58px;
  width: 100%;
  border: 1px solid transparent;
  :hover:not(:disabled) {
    border: 1px solid black;
  }
  transiton: all 0.5s ease-out;
  @media screen and (max-height: 780px) {
    margin-bottom: 20px;
  }
`;

const Icon = styled(Box)`
  width: 40px;
  display: flex;
  justify-content: center;
  > img {
    cursor: pointer;
  }
  margin-right: 50px;
`;

const Menu = styled.ul`
  position: relative;
`;
export default Hamburger;
