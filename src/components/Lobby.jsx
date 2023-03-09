import React from "react";
import RoomBar from "./RoomBar";
import WaitingRoom from "./WaitingRoom";
import { useSelector, useDispatch } from "react-redux";

function Lobby() {
  const currentRoom = useSelector((state) => state.game.inGame.currentRoom);
  return <>{currentRoom ? <WaitingRoom /> : <RoomBar />}</>;
}

export default Lobby;
