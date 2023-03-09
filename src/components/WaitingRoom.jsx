import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setIsGameStarted, setPlayers } from "../features/gameSlice";

function WaitingRoom() {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.game.general.socket);
  const room = useSelector((state) => state.game.inGame.currentRoom);
  const players = useSelector((state) => state.game.inGame.players);
  const maxPlayers = useSelector((state) => state.game.inGame.maxPlayers);
  const [countDown, setCountDown] = useState(0);

  const handlePlayerJoinedRoom = (data) => {
    dispatch(setPlayers(data.clients));
    toast.success(`${data.username} joined this room!`);
  };
  useEffect(() => {
    socket.on("player-joined-room", handlePlayerJoinedRoom);
    return () => {
      socket.off("player-joined-room", handlePlayerJoinedRoom);
    };
  }, [socket]);

  useEffect(() => {
    if (players.length == maxPlayers) {
      var countDownInterval = setInterval(() => {
        if (countDown <= 0) {
          dispatch(setIsGameStarted(true));
          socket.emit("game-started");
          socket.emit("change-player", {
            currentPlayer: undefined,
          });
          return;
        }
        setCountDown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(countDownInterval);
    };
  }, [players, countDown]);

  return (
    <>
      {players.length === maxPlayers ? (
        <>
          <h1>Game starting in {countDown}</h1>
        </>
      ) : (
        <>
          <h1>Waiting for more players...</h1>
          <h2>
            {players.length} / {maxPlayers}
          </h2>
        </>
      )}
    </>
  );
}

export default WaitingRoom;
