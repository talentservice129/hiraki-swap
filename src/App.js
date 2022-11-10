import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Features from "./pages/Features";
import Partnerships from "./pages/Partnerships";
import Trade from "./pages/Trade";
import Orders from "./pages/Orders";

import "./App.css";
import TopBar from "./components/Topbar";

import Parse from "parse/dist/parse.min.js";

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = "nd3aX0TcHuF1yq58fJjynLeBNMZKsKhcB0X6JCuO";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";
const PARSE_JAVASCRIPT_KEY = "utUXH56TkHiPOidZBgZejxf4VGTszh1QHYXBHsUN";
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route exact path="/" element={<Navigate to={"/home"} />} />
        <Route exact path={"/home"} element={<Home />} />
        <Route exact path={"/features"} element={<Features />} />
        <Route exact path={"/partnerships"} element={<Partnerships />} />
        <Route exact path={"/trade"} element={<Trade />} />
        <Route exact path={"/orders"} element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
