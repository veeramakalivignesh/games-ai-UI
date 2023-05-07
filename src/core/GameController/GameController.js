import { useRef, useEffect} from 'react';
import GameUtils from '../utils/GameUtils';
import "./GameController.css"

/**
 * This is a functional react component to display
 * the side bar that contains game logs and buttons
 * 
 * @author cant12
 */

function GameController({ gameLog, gameMode, gameCondition, setGameCondition, setGameMode }) {
    const containerRef = useRef(null);

    useEffect(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    });

    const startButtonOnclick = () => {
        if (gameCondition === GameUtils.GAME_CONDITION.OFF) {
            if (gameMode === GameUtils.GAME_MODE.PLAYER_PLAYER) {
                setGameCondition(GameUtils.GAME_CONDITION.USER_PLAY);
            } else if (gameMode === GameUtils.GAME_MODE.BOT_PLAYER) {
                if (window.confirm("Do you want to be the black player?")) {
                    setGameCondition(GameUtils.GAME_CONDITION.USER_PLAY);
                } else {
                    setGameCondition(GameUtils.GAME_CONDITION.BOT_PRIMARY_PLAY);
                }
            } else if (gameMode === GameUtils.GAME_MODE.BOT_BOT) {
                if (window.confirm("In BotVsBot mode, primary and secondary bots will be playing " +
                    "against each other. These will be configured on the server side.\n\n" +
                    "Do you want the primary bot to be the black player?")) {
                    setGameCondition(GameUtils.GAME_CONDITION.BOT_PRIMARY_PLAY);
                } else {
                    setGameCondition(GameUtils.GAME_CONDITION.BOT_SECONDARY_PLAY);
                }
            }
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

    const handleDropdownChange = (event) => {
        setGameMode(event.target.value);
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
                <select className='button dropdown'
                    disabled={!(gameCondition === GameUtils.GAME_CONDITION.OFF)}
                    value={gameMode}
                    onChange={handleDropdownChange}>

                    <option value={GameUtils.GAME_MODE.PLAYER_PLAYER}>PlayerVsPlayer</option>
                    <option value={GameUtils.GAME_MODE.BOT_PLAYER}>BotVsPlayer</option>
                    <option value={GameUtils.GAME_MODE.BOT_BOT}>BotVsBot</option>
                </select>
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