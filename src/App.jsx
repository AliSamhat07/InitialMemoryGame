import { useState } from "react";
import RoomBar from "./components/RoomBar.jsx";
import React from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lobby from "./components/Lobby.jsx";
import Game from "./components/Game.jsx";
function App() {
  const [first, setFirst] = useState("fries");
  const isGameStarted = useSelector((state) => state.game.inGame.isGameStarted);
  return (
    <>
      {!isGameStarted ? <Lobby /> : <Game />}
      <ToastContainer />
    </>
  );
}

export default App;
