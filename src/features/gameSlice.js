import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");
const username = localStorage.getItem("game-username") || "";

const initialState = {
  general: {
    socket: socket,
    username,
  },
  inGame: {
    socketId: "",
    currentRoom: "",
    players: [],
    currentPlayer: undefined,
    maxPlayers: "0",
    cards: [],
    isGameStarted: false,
  },
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      state.inGame.currentRoom = action.payload;
    },
    setSocketId: (state, action) => {
      state.inGame.socketId = action.payload;
    },
    setUsername: (state, action) => {
      state.general.username = action.payload;
    },
    setMaxPlayers: (state, action) => {
      state.inGame.maxPlayers = action.payload;
    },
    setPlayers: (state, action) => {
      state.inGame.players = action.payload;
    },
    setIsGameStarted: (state, action) => {
      state.inGame.isGameStarted = action.payload;
    },
    setCurrentPlayer: (state, action) => {
      state.inGame.currentPlayer = action.payload;
    },
    setCards: (state, action) => {
      state.inGame.cards = action.payload;
    },

    flipCard: (state, action) => {
      state.inGame.cards.forEach((card) => {
        if (card.id == action.payload) {
          card.isFlipped = !card.isFlipped;
        }
      });
    },
    increaseScore: (state, action) => {
      state.inGame.players.forEach((player) => {
        if (player.socketId == action.payload) {
          player.score += 1;
        }
      });
    },
  },
});

export const {
  setCurrentRoom,
  setSocketId,
  setUsername,
  setMaxPlayers,
  setPlayers,
  setIsGameStarted,
  setCurrentPlayer,
  setCards,
  flipCard,
  increaseScore,
} = gameSlice.actions;

export default gameSlice.reducer;
