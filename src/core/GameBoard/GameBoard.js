import { useEffect, useState } from 'react';
import CannonUtils from '../../modules/cannon/utils/CannonUtils';
import CannonBotClient from '../../modules/cannon/api/CannonBotClient';
import Cannon from '../../modules/cannon/components/Cannon';
import BotClient from '../api/BotClient';
import GameUtils from '../utils/GameUtils';
var _ = require('lodash');

// Game board
export default function GameBoard({ gameCondition, savedGameLog, gameMode, setGameCondition, addMoveLog, resetParent }) {
    const gameUtils = new CannonUtils();
    const botClient = new CannonBotClient();

    const [gameState, setGameState] = useState(gameUtils.getInitialGameState());
    const [guideState, setGuideState] = useState(gameUtils.getInitialGuideState());
    const [isBlackTurn, setBlackTurn] = useState(true);
    const [replayCounter, setReplayCounter] = useState(-1);

    // reset all states except counter (for replay logic)
    const reset = () => {
        setGameState(gameUtils.getInitialGameState());
        setGuideState(gameUtils.getInitialGuideState());
        setBlackTurn(true);
    };

    const updateGameConditionBasedOnMode = () => {
        if ((gameCondition !== GameUtils.GAME_CONDITION.USER_PLAY) && (gameCondition !== GameUtils.GAME_CONDITION.BOT_PLAY)) {
            return;
        }
        if (gameMode === GameUtils.GAME_MODE.BOT_PLAYER) {
            if (gameCondition === GameUtils.GAME_CONDITION.BOT_PLAY) {
                setGameCondition(GameUtils.GAME_CONDITION.USER_PLAY);
            } else {
                setGameCondition(GameUtils.GAME_CONDITION.BOT_PLAY);
            }
        }
    };

    // execute a given move if valid
    const executeMove = (moveDict) => {
        if (!gameUtils.isMoveValid(_.cloneDeep(gameState), isBlackTurn, moveDict)) {
            throw Error("Invalid move was given to be executed " + gameUtils.convertMoveDictToString(moveDict));
        }

        const newGameState = gameUtils.getGameStateAfterMove(_.cloneDeep(gameState), moveDict);
        setGameState(newGameState);
        setGuideState(gameUtils.getInitialGuideState());
        setBlackTurn(!isBlackTurn);
        addMoveLog(gameUtils.convertMoveDictToString(moveDict));

        const newGameCondition = gameUtils.getGameConditionIfOver(gameCondition, newGameState, !isBlackTurn);
        if (GameUtils.isGameOverCondition(newGameCondition)) {
            setGameCondition(newGameCondition);
        } else {
            updateGameConditionBasedOnMode();
        }
    }

    /**
     * animate a given move if valid 
     * 
     * setTimeout does not use the current state value, it uses the initial one.
     * One needs to keep this in mind while handling aynchronous state changes
     * like button clicks inside of this function
     */
    const executeMoveWithAnimation = (moveDict) => {
        const delay = 500;

        // show guide after 0.5s
        setTimeout(() => {
            setGuideState(gameUtils.getGuideStateForMoveAnimation(moveDict));
        }, delay);

        // execute move after 1s
        setTimeout(() => {
            executeMove(moveDict);
            // increment counter to trigger next move replay
            if (gameCondition === GameUtils.GAME_CONDITION.REPLAY) {
                setReplayCounter(replayCounter + 1);
            }
        }, 2 * delay);
    };

    // cleanups while gameCondition changes
    useEffect(() => {
        if (gameCondition === GameUtils.GAME_CONDITION.OFF) {
            reset();
            setReplayCounter(-1);
        } else if (gameCondition === GameUtils.GAME_CONDITION.REPLAY) {
            // kicking off replayfrom start
            if (replayCounter < 0) {
                reset();
                setReplayCounter(0);
            }
            // resuming replay after pause
            else if (replayCounter < savedGameLog.length) {
                const moveDict = gameUtils.convertMoveStringToDict(savedGameLog[replayCounter]);
                executeMoveWithAnimation(moveDict);
            }
        } else if (GameUtils.isGameOverCondition(gameCondition)) {
            setReplayCounter(-1);
        } else if (gameCondition === GameUtils.GAME_CONDITION.BOT_PLAY) {
            botClient.fetchBotMove(gameState, isBlackTurn)
                .then((botMove) => {
                    executeMoveWithAnimation(gameUtils.convertMoveStringToDict(gameUtils.invertMove(botMove)))
                });
        }
    }, [gameCondition]);

    // replay logic - will be executed only when counter changes
    useEffect(() => {
        if (gameCondition === GameUtils.GAME_CONDITION.REPLAY) {
            if (replayCounter >= 0 && replayCounter < savedGameLog.length) {
                const moveDict = gameUtils.convertMoveStringToDict(savedGameLog[replayCounter]);
                executeMoveWithAnimation(moveDict);
            }
        }
        // handle asynch game quit during replay
        else if (gameCondition === GameUtils.GAME_CONDITION.OFF) {
            reset();
            setReplayCounter(-1);
            resetParent();
        }
    }, [replayCounter]);

    return (
        <Cannon
            gameState={gameState}
            guideState={guideState}
            isBlackTurn={isBlackTurn}
            gameCondition={gameCondition}
            setGuideState={setGuideState}
            executeMove={executeMove}
        />
    );
}