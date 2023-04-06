import { useRef, useEffect } from 'react';
import CannonUtils from '../modules/cannon/CannonUtils';
import "./GameController.css"

export default function GameController({ gameLog, gameCondition, setGameCondition }) {
    const containerRef = useRef(null);

    useEffect(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    });

    const startButtonOnclick = () => {
        if (gameCondition === CannonUtils.GAME_CONDITION.OFF) {
            setGameCondition(CannonUtils.GAME_CONDITION.ON);
        } else {
            if (window.confirm("All the game content will be lost. Are you sure you want to quit?")) {
                setGameCondition(CannonUtils.GAME_CONDITION.OFF);
            }
        }
    }

    let i = 0;
    const gameLogComponent = [];
    for (let log of gameLog) {
        const textClassName = i % 2 ? 'game-log-text white' : 'game-log-text black';
        gameLogComponent.push(
            <input
                className={textClassName}
                type={"text"}
                value={log}
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
                    {gameCondition === CannonUtils.GAME_CONDITION.OFF ? "Start" : "Quit"}
                </button>
            </div>
            <div>
                <button className='button'> Replay </button>
            </div>
        </div>
    );
}