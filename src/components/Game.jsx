import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPlayer, setCards } from "../features/gameSlice.js";
import { flipCard, increaseScore } from "../features/gameSlice.js";
import GameHeader from "./GameHeader.jsx";
import { toast } from "react-toastify";

function Game() {
  const dispatch = useDispatch();
  const currentPlayer = useSelector((state) => state.game.inGame.currentPlayer);
  const username = useSelector((state) => state.game.general.username);
  const socket = useSelector((state) => state.game.general.socket);
  const socketId = useSelector((state) => state.game.inGame.socketId);
  const cards = useSelector((state) => state.game.inGame.cards);
  const players = useSelector((state) => state.game.inGame.players);

  const [myFlippedCards, setMyFlippedCards] = useState([]);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleFlipCard = (e) => {
    if (currentPlayer != username) return toast.warning("Not your turn!");
    if (e.target.dataset.isflipped == "true")
      return toast.warning("Card already flipped!");
    if (myFlippedCards.length == 2)
      return toast.warning("Can't flip more than 2 cards!");

    socket.emit("flip-cards", { ids: [e.target.dataset.id] });

    if (myFlippedCards.length == 1) {
      if (myFlippedCards[0].name == e.target.dataset.name) {
        socket.emit("increase-score", { socketId });
        setMyFlippedCards([]);
      } else {
        setTimeout(() => {
          setMyFlippedCards([]);
          socket.emit("change-player", { currentPlayer });
          socket.emit("flip-cards", {
            ids: [myFlippedCards[0].id, e.target.dataset.id],
          });
        }, 1000);
      }
    } else {
      setMyFlippedCards((prev) => [
        ...prev,
        { name: e.target.dataset.name, id: e.target.dataset.id },
      ]);
    }
  };

  const handlePlayerChanged = (data) => {
    dispatch(setCurrentPlayer(data.currentPlayer));
  };
  const handleGameStarted = (data) => {
    dispatch(setCards(data.cards));
  };
  const handleCardsFlipped = (data) => {
    data.ids.forEach((id) => {
      dispatch(flipCard(id));
    });
  };
  const handleScoreIncreased = (data) => {
    dispatch(increaseScore(data.socketId));
  };
  useEffect(() => {
    socket.on("player-changed", handlePlayerChanged);
    socket.on("game-started", handleGameStarted);
    socket.on("cards-flipped", handleCardsFlipped);
    socket.on("score-increased", handleScoreIncreased);
    return () => {
      socket.off("player-changed", handlePlayerChanged);
      socket.off("game-started", handleGameStarted);
      socket.off("cards-flipped", handleCardsFlipped);
      socket.off("score-increased", handleScoreIncreased);
    };
  }, [socket]);

  useEffect(() => {
    const gameOver = cards.every((card) => card.isFlipped == true);
    if (cards.length > 0 && gameOver) {
      let winner = { score: 0, username: undefined };
      players.forEach((player) =>
        player.score > winner.score
          ? (winner = { username: player.username, score: player.score })
          : null
      );
      setIsGameEnded(true);
      setWinner(winner);
      socket.emit("end-game");
    }
  }, [cards]);

  return (
    <>
      {!isGameEnded ? (
        <div>
          <GameHeader
            myFlippedCards={myFlippedCards}
            setMyFlippedCards={setMyFlippedCards}
          />
          <section>
            {cards.length > 0 &&
              cards.map((card) => {
                return (
                  <Card
                    key={card.id}
                    card={card}
                    handleFlipCard={handleFlipCard}
                  />
                );
              })}
          </section>
        </div>
      ) : (
        <>
          {winner.username} got the the highest score {winner.score}!
        </>
      )}
    </>
  );
}

function Card({ card, handleFlipCard }) {
  return (
    <div>
      <h3>{card.name}</h3>
      <img
        alt="card"
        src={
          card.isFlipped
            ? `.././public/cards/${card.name}.png`
            : ".././public/cards/blank.png"
        }
        key={card.id}
        data-isflipped={card.isFlipped}
        data-id={card.id}
        data-name={card.name}
        onClick={handleFlipCard}
      />
    </div>
  );
}

export default Game;
