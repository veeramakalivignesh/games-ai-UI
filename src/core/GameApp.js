import { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard/GameBoard';
import Header from "./Header";
import GameController from "./components/GameController/GameController";
import GameUtils from './utils/GameUtils';

export default function GameApp() {
    const [gameLog, setGameLog] = useState([]);
    const [savedGameLog, setSavedGameLog] = useState([]);
    const [isUnderReplay, setUnderReplay] = useState(false);
    const [gameCondition, setGameCondition] = useState(GameUtils.GAME_CONDITION.OFF);
    const [gameMode, setGameMode] = useState(GameUtils.GAME_MODE.BOT_PLAYER);

    const reset = () => {
        setGameLog([]);
        setSavedGameLog([]);
        setUnderReplay(false);
    }

    const addMoveLog = (move) => {
        let newGameLog = gameLog.slice();
        newGameLog.push(move);
        setGameLog(newGameLog);
    }

    useEffect(() => {
        if (gameCondition === GameUtils.GAME_CONDITION.OFF) {
            reset();
        } else if (gameCondition === GameUtils.GAME_CONDITION.REPLAY) {
            if (!isUnderReplay) {
                setUnderReplay(true);
                setGameLog([]);
            }
        }

        if (!GameUtils.isGameOverCondition(gameCondition)) {
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
        setUnderReplay(false);

        setTimeout(() => {
            alert(alertMessage);
        }, 100);
    }, [gameCondition]);

    const gameTitle = "Game of Cannons";
    return (
        <>
            <Header />

            <div className='p-1 text-center'>
                <h1>{gameTitle}</h1>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
            }}>
                <GameBoard
                    gameCondition={gameCondition}
                    savedGameLog={savedGameLog}
                    gameMode={gameMode}
                    setGameCondition={setGameCondition}
                    addMoveLog={addMoveLog}
                    resetParent={reset}
                />
                <GameController
                    gameLog={gameLog}
                    gameCondition={gameCondition}
                    gameMode={gameMode}
                    setGameCondition={setGameCondition}
                    setGameMode={setGameMode}
                />
            </div>
        </>
    );
}
