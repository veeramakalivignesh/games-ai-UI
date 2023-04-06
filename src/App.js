import { useState } from 'react';
import Cannon from "./modules/cannon/Cannon"
import Header from "./core/Header";
import GameController from "./core/GameControler";

export default function App() {
  const [gameLog, setGameLog] = useState([]);
  const addMoveToLog = (move) => {
    let newGameLog = gameLog.slice();
    newGameLog.push(move);
    setGameLog(newGameLog);
  }
  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px'
      }}>
        <Cannon addMoveToLog={addMoveToLog}/>
        <GameController gameLog={gameLog}/>
      </div>
    </>
  );
}
