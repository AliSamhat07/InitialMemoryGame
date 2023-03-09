import React from "react";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSocketId,
  setPlayers,
  setCurrentRoom,
  setMaxPlayers,
  setUsername,
} from "../features/gameSlice";

import Spinner from "./Spinner";
import { toast } from "react-toastify";

function RoomBar() {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.game.general.socket);
  const socketId = useSelector((state) => state.game.inGame.socketId);
  const username = useSelector((state) => state.game.general.username);
  const [roomData, setRoomData] = useState({
    existingRoom: "test",
    newRoom: "test",
    maxPlayers: 2,
    username: username,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setRoomData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const createRoom = () => {
    if (roomData.newRoom == "" || roomData.username == "")
      return toast.error("Please fill in all fields...");
    localStorage.setItem("game-username", roomData.username);
    setIsLoading(true);
    socket.emit("create-room", {
      maxPlayers: roomData.maxPlayers,
      room: roomData.newRoom,
      username: roomData.username,
      socketId,
    });
  };

  const joinRoom = () => {
    localStorage.setItem("game-username", roomData.username);
    setIsLoading(true);
    socket.emit("join-room", {
      room: roomData.existingRoom,
      username: roomData.username,
    });
  };
  const handleRoomJoined = (data) => {
    if (roomData.username != data.username) {
      localStorage.setItem("username", data.username);
      dispatch(setUsername(data.username));
    }
    setIsLoading(false);
    dispatch(setPlayers(data.clients));
    dispatch(setMaxPlayers(data.maxPlayers));
    dispatch(setSocketId(data.socketId));
    dispatch(setCurrentRoom(data.room));
    toast.success("Room joined succefully!");
  };
  const handleRoomCreated = (data) => {
    setIsLoading(false);
    dispatch(setUsername(data.username));
    dispatch(setMaxPlayers(data.maxPlayers));
    dispatch(setSocketId(data.socketId));
    dispatch(setCurrentRoom(data.room));
    dispatch(setPlayers(data.clients));
    toast.success("Room created succefully!");
  };
  const handleRoomError = (data) => {
    toast.error(data.message);
    setIsLoading(false);
  };

  useEffect(() => {
    socket.on("room-joined", handleRoomJoined);
    socket.on("room-created", handleRoomCreated);
    socket.on("room-error", handleRoomError);
    return () => {
      socket.off("room-joined", handleRoomJoined);
      socket.off("room-created", handleRoomCreated);
      socket.off("room-error", handleRoomError);
    };
  }, [socket, socketId]);

  if (isLoading) return <Spinner />;

  return (
    <section>
      <div>
        <input
          onChange={handleInputChange}
          name="username"
          value={roomData.username}
          placeholder="Enter your username"
        />
      </div>

      <div>
        <input
          onChange={handleInputChange}
          name="newRoom"
          value={roomData.newRoom}
        />
        <select name="maxPlayers" onChange={handleInputChange}>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <button onClick={createRoom}>Create room</button>
      </div>

      <div>
        <input
          onChange={handleInputChange}
          name="existingRoom"
          value={roomData.existingRoom}
        />
        <button onClick={joinRoom}>Join room</button>
      </div>
    </section>
  );
}

export default RoomBar;
