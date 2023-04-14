import { useRef, useEffect } from 'react';
import GameUtils from './GameUtils';
import "./GameController.css"

// side bar that contains game logs and buttons
function GameController({ gameLog, isUnderReplay, gameCondition, setGameCondition }) {
    const containerRef = useRef(null);

    useEffect(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    });

    const startButtonOnclick = () => {
        if (gameCondition === GameUtils.GAME_CONDITION.OFF) {
            setGameCondition(GameUtils.GAME_CONDITION.USER_PLAY);
        } else {
            if (window.confirm("All the game content will be lost. Are you sure you want to quit?")) {
                setGameCondition(GameUtils.GAME_CONDITION.OFF);
            }
        }
    };

    let replayButtonText = "";
    if (gameCondition === GameUtils.GAME_CONDITION.REPLAY) {
        replayButtonText = "Pause";
    } else if (gameCondition === GameUtils.GAME_CONDITION.PAUSE) {
        replayButtonText = "Continue";
    } else {
        replayButtonText = "Replay";
    }

    const replayButtonClick = () => {
        if (replayButtonText === "Pause") {
            setGameCondition(GameUtils.GAME_CONDITION.PAUSE);
        } else {
            setGameCondition(GameUtils.GAME_CONDITION.REPLAY);
        }
    };

    const isReplayEnabled = () => {
        return (GameUtils.isGameOverCondition(gameCondition) || (gameCondition === GameUtils.GAME_CONDITION.REPLAY)
            || (gameCondition === GameUtils.GAME_CONDITION.PAUSE));
    };

    let i = 0;
    const gameLogComponent = [];
    for (let log of gameLog) {
        const textClassName = i % 2 ? 'game-log-text white' : 'game-log-text black';
        gameLogComponent.push(
            <input
                key={i}
                className={textClassName}
                type={"text"}
                value={log}
                disabled={true}
            />
        );
        i++;
    }

    return (
        <div style={{ verticalAlign: "middle" }}>
            <div className='game-log-title'>
                GAME LOG
            </div>
            <div className='game-log-box' ref={containerRef}>
                {gameLogComponent}
            </div>
            <div>
                <button className='button' onClick={startButtonOnclick}>
                    {gameCondition === GameUtils.GAME_CONDITION.OFF ? "Start" : "Quit"}
                </button>
            </div>
            <div>
                <button className='button' onClick={replayButtonClick} disabled={!isReplayEnabled()}>
                    {replayButtonText}
                </button>
            </div>
        </div>
    );
}

export default GameController;