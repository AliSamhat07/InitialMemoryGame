import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function GameHeader({ myFlippedCards, setMyFlippedCards }) {
  const currentPlayer = useSelector((state) => state.game.inGame.currentPlayer);
  const players = useSelector((state) => state.game.inGame.players);
  const socket = useSelector((state) => state.game.general.socket);
  const username = useSelector((state) => state.game.general.username);
  const [countDown, setCountDown] = useState(2);

  useEffect(() => {
    var countDownInterval = setInterval(() => {
      if (countDown <= 0) {
        socket.emit("change-player", { currentPlayer });
        const ids = myFlippedCards.map((card) => card.id);
        socket.emit("flip-cards", { ids });
        setMyFlippedCards([]);

        return;
      }
      setCountDown((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(countDownInterval);
    };
  }, [countDown]);

  useEffect(() => {
    setCountDown(2);
  }, [currentPlayer]);

  return (
    <>
      <div>
        {players.map((player) => (
          <div key={Math.random()}>
            {player.username} : {player.score}
          </div>
        ))}
      </div>
      <div>{countDown}</div>
      <h1>
        {currentPlayer == username
          ? "It's your turn!"
          : `It's ${currentPlayer} 's turn!`}
      </h1>
    </>
  );
}

export default GameHeader;
