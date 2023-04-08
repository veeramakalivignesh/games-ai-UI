import { useEffect, useState } from 'react';
import Cannon from "./modules/cannon/Cannon"
import Header from "./core/Header";
import GameController from "./core/GameControler";
import GameUtils from './core/GameUtils';

export default function App() {
  const [gameLog, setGameLog] = useState([]);
  const [savedGameLog, setSavedGameLog] = useState([]);
  const [gameCondition, setGameCondition] = useState(GameUtils.GAME_CONDITION.OFF);

  const reset = () => {
    setGameLog([]);
    setSavedGameLog([]);
  }

  const addMoveLog = (move) => {
    let newGameLog = gameLog.slice();
    newGameLog.push(move);
    setGameLog(newGameLog);
  }

  useEffect(() => {
    if (gameCondition === GameUtils.GAME_CONDITION.PLAY) {
      return;
    } else if (gameCondition === GameUtils.GAME_CONDITION.OFF) {
      reset();
      return;
    } else if (gameCondition === GameUtils.GAME_CONDITION.REPLAY) {
      setGameLog([]);
      return;
    }

    let alertMessage = "";
    let newGameLog = gameLog.slice();
    newGameLog.push("-----------");
    if (gameCondition === GameUtils.GAME_CONDITION.BLACK_WINS) {
      newGameLog.push("Black Wins!");
      alertMessage = "!! GAME OVER --> BLACK WINS !!";
    } else if (gameCondition === GameUtils.GAME_CONDITION.WHITE_WINS) {
      newGameLog.push("White Wins!");
      alertMessage = "!! GAME OVER --> WHITE WINS !!";
    } else if (gameCondition === GameUtils.GAME_CONDITION.STALEMATE) {
      newGameLog.push("Stalemate!");
      alertMessage = "!! GAME OVER --> STALEMATE !!";
    }
    setSavedGameLog(gameLog);
    setGameLog(newGameLog);
    setTimeout(() => {
      alert(alertMessage);
    }, 100);
  }, [gameCondition]);

  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px'
      }}>
        <Cannon
          gameCondition={gameCondition}
          savedGameLog={savedGameLog}
          setGameCondition={setGameCondition}
          addMoveLog={addMoveLog}
          resetParent={reset}
        />
        <GameController
          gameLog={gameLog}
          gameCondition={gameCondition}
          setGameCondition={setGameCondition}
        />
      </div>
    </>
  );
}
