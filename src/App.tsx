import { useState } from "react";
import "./App.css";
import SideBar from "./components/sidebar/SideBar";
import TopPane from "./components/toppane/TopPane";
import ResponsiveDrawer from "./demo";

function App() {
  return (
    <>
      {/* <ResponsiveDrawer />  */}
      <SideBar />
      <TopPane />
      {/* Main Content */}
    </>
  );
}

export default App;
