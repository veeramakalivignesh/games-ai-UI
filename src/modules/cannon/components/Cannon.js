import { useEffect, useState } from 'react';
import "./Cannon.css";
import CannonUtils from '../utils/CannonUtils';
import Square from './CannonComponents';
import GameUtils from "../../../core/utils/GameUtils";
var _ = require('lodash');

/**
 * This is functional react component that defines
 * the Cannon game board and its UI
 * 
 * @author cant12 
 */

export default function Cannon({ gameState, guideState, isBlackTurn, gameCondition, setGameState, setGuideState, executeMove}) {
    const cannonUtils = new CannonUtils();

    const [gameSize, setGameSize] = useState([8, 8]);

    useEffect(() => {
        CannonUtils.setSize(gameSize[0], gameSize[1]);
        setGameState(cannonUtils.getInitialGameState())
        setGuideState(cannonUtils.getInitialGuideState())
    }, [gameSize]);

    const sizeButtonClick = {
        EIGHT_EIGHT: () => {
            setGameSize([8, 8]);
        },
        TEN_EIGHT: () => {
            setGameSize([10, 8]);
        },
        EIGHT_TEN: () => {
            setGameSize([8, 10]);
        },
        TEN_TEN: () => {
            setGameSize([10, 10]);
        }
    };

    const isPieceCurrentPlayer = (position) => {
        return (isBlackTurn && gameState[position[0]][position[1]] === 'B') ||
            (!isBlackTurn && gameState[position[0]][position[1]] === 'W');
    };

    // select a square on click
    const selectSquare = (position) => {
        if (isPieceCurrentPlayer(position) && (gameCondition === GameUtils.GAME_CONDITION.USER_PLAY)) {
            setGuideState(cannonUtils.getGuideStateAfterSelection(_.cloneDeep(gameState), position));
        } else {
            setGuideState(cannonUtils.getInitialGuideState());
        }
    };

    // render the board
    const rows = []
    for (let i = 0; i < CannonUtils.NUM_ROWS; i++) {
        const squares = []
        for (let j = 0; j < CannonUtils.NUM_COLUMNS; j++) {
            let isSoldierSelected = false;
            if (guideState.selectedPosition) {
                isSoldierSelected = guideState.selectedPosition[0] === i && guideState.selectedPosition[1] === j;
            }
            squares.push(
                <Square
                    key={j}
                    position={[i, j]}
                    squareGameState={gameState[i][j]}
                    squareMarkerState={guideState.targetsMarkerState[i][j]}
                    isSoldierSelected={isSoldierSelected}
                    selectedPosition={guideState.selectedPosition}
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
        <div style={{ verticalAlign: "middle" }}>
            <div style={{ borderStyle: 'outset', borderWidth: '10px' }}>
                {rows}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                    className={(gameSize[0] === 8 && gameSize[1] === 8) ? 'box left selected' : 'box left'}
                    disabled={gameCondition !== GameUtils.GAME_CONDITION.OFF}
                    onClick={sizeButtonClick.EIGHT_EIGHT}>
                    8x8
                </button>
                <button
                    className={(gameSize[0] === 10 && gameSize[1] === 8) ? 'box selected' : 'box'}
                    disabled={gameCondition !== GameUtils.GAME_CONDITION.OFF}
                    onClick={sizeButtonClick.TEN_EIGHT}>
                    10x8
                </button>
                <button
                    className={(gameSize[0] === 8 && gameSize[1] === 10) ? 'box selected' : 'box'}
                    disabled={gameCondition !== GameUtils.GAME_CONDITION.OFF}
                    onClick={sizeButtonClick.EIGHT_TEN}>
                    8x10
                </button>
                <button
                    className={(gameSize[0] === 10 && gameSize[1] === 10) ? 'box right selected' : 'box right'}
                    disabled={gameCondition !== GameUtils.GAME_CONDITION.OFF}
                    onClick={sizeButtonClick.TEN_TEN}>
                    10x10
                </button>
            </div>
        </div>
    );
}