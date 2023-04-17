import { useEffect, useState } from 'react';
import "./Cannon.css";
import CannonUtils from './utils/CannonUtils';
import Square from './components/CannonComponents';
import GameUtils from '../../core/GameUtils';
import CannonBotClient from './api/CannonBotClient';
var _ = require('lodash');

// Cannon game board
export default function Board({ gameCondition, savedGameLog, gameMode, setGameCondition, addMoveLog, resetParent, getLastMove }) {
    const [gameState, setGameState] = useState(CannonUtils.getInitialGameState());
    const [guideState, setGuideState] = useState(CannonUtils.getInitialGuideState());
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [isBlackTurn, setBlackTurn] = useState(true);
    const [replayCounter, setReplayCounter] = useState(-1);

    // reset all states except counter (for replay logic)
    const reset = () => {
        setGameState(CannonUtils.getInitialGameState());
        setGuideState(CannonUtils.getInitialGuideState());
        setSelectedPosition(null);
        setBlackTurn(true);
    };

    const isPieceCurrentPlayer = (position) => {
        return (isBlackTurn && gameState[position[0]][position[1]] === 'B') ||
            (!isBlackTurn && gameState[position[0]][position[1]] === 'W');
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

    // select a square on click
    const selectSquare = (position) => {
        if (isPieceCurrentPlayer(position) && (gameCondition === GameUtils.GAME_CONDITION.USER_PLAY)) {
            setGuideState(CannonUtils.getGuideStateAfterSelection(_.cloneDeep(gameState), position));
            setSelectedPosition(position);
        } else {
            setGuideState(CannonUtils.getInitialGuideState());
            setSelectedPosition(null);
        }
    };

    // TODO need to check move validity
    const executeMove = (moveDict) => {
        if (gameCondition === GameUtils.GAME_CONDITION.USER_PLAY) {
            moveDict.selectedPosition = selectedPosition;
        }

        if (!CannonUtils.isMoveValid(_.cloneDeep(gameState), isBlackTurn, moveDict)) {
            throw Error("Invalid move was given to be executed " + CannonUtils.convertMoveDictToString(moveDict));
        }

        const newGameState = CannonUtils.getGameStateAfterMove(_.cloneDeep(gameState), moveDict);
        setGameState(newGameState);
        setGuideState(CannonUtils.getInitialGuideState());
        setSelectedPosition(null);
        setBlackTurn(!isBlackTurn);
        addMoveLog(CannonUtils.convertMoveDictToString(moveDict));

        const newGameCondition = CannonUtils.getGameCondition(gameCondition, newGameState, !isBlackTurn);
        if (GameUtils.isGameOverCondition(newGameCondition)) {
            setGameCondition(newGameCondition);
        } else {
            updateGameConditionBasedOnMode();
        }
    }

    // animate a given move if valid
    const executeMoveWithAnimation = (moveDict) => {
        const delay = 500;

        /**
         * setTimeout does not use the current state value, it uses the initial one
         * One needs to keep this in mind while handling aynchronous state changes
         * like button clicks  
         */

        // show guide after 0.5s
        setTimeout(() => {
            setGuideState(CannonUtils.getGuideStateForMoveAnimation(moveDict));
            setSelectedPosition(moveDict.selectedPosition);
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
                const moveDict = CannonUtils.convertMoveStringToDict(savedGameLog[replayCounter]);
                executeMoveWithAnimation(moveDict);
            }
        } else if (GameUtils.isGameOverCondition(gameCondition)) {
            setReplayCounter(-1);
        } else if (gameCondition === GameUtils.GAME_CONDITION.BOT_PLAY) {
            CannonBotClient.fetchBotMove(gameState, isBlackTurn)
                .then((botMove) => {
                    executeMoveWithAnimation(CannonUtils.convertMoveStringToDict(CannonUtils.invertMove(botMove)))
                });
        }
    }, [gameCondition]);

    // replay logic - will be executed only when counter changes
    useEffect(() => {
        if (gameCondition === GameUtils.GAME_CONDITION.REPLAY) {
            if (replayCounter >= 0 && replayCounter < savedGameLog.length) {
                const moveDict = CannonUtils.convertMoveStringToDict(savedGameLog[replayCounter]);
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


    // render the board
    const rows = []
    for (let i = 0; i < CannonUtils.NUM_ROWS; i++) {
        const squares = []
        for (let j = 0; j < CannonUtils.NUM_COLUMNS; j++) {
            let isSoldierSelected = false;
            if (selectedPosition) {
                isSoldierSelected = selectedPosition[0] === i && selectedPosition[1] === j;
            }
            squares.push(
                <Square
                    key={j}
                    position={[i, j]}
                    squareGameState={gameState[i][j]}
                    squareGuideState={guideState[i][j]}
                    isSoldierSelected={isSoldierSelected}
                    selectSquare={selectSquare}
                    executeMove={executeMove}
                />
            );
        }
        rows.push(
            <div className="board-row" key={i}>
                {squares}
            </div>
        );
    }

    return (
        <div style={{ borderStyle: 'outset', borderWidth: '10px' }}>
            {rows}
        </div>
    );
}
