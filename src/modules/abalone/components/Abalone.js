import { useEffect, useState } from 'react';
import "./Abalone.css";
import AbaloneUtils from '../utils/AbaloneUtils';
import GameUtils from "../../../core/utils/GameUtils";
import Hexagon from './AbaloneComponents';
import { FaHeart } from 'react-icons/fa';
var _ = require('lodash');

/**
 * This is functional react component that defines
 * the Abalone game board and its UI
 * 
 * @author cant12 
 */

export default function Abalone({ gameState, guideState, isBlackTurn, gameCondition, setGameState, setGuideState, executeMove}) {
    const abaloneUtils = new AbaloneUtils();
    const [gameSize, setGameSize] = useState(5);
    
    useEffect(() => {
        AbaloneUtils.setSize(gameSize);
        setGameState(abaloneUtils.getInitialGameState())
        setGuideState(abaloneUtils.getInitialGuideState())
    }, [gameSize]);

    const sizeButtonClick = {
        FOUR: () => {
            setGameSize(4);
        },
        FIVE: () => {
            setGameSize(5);
        },
        SIX: () => {
            setGameSize(6);
        }
    };

    const isPieceCurrentPlayer = (position) => {
        return (isBlackTurn && gameState[position[0]][position[1]] === 'B') ||
            (!isBlackTurn && gameState[position[0]][position[1]] === 'W');
    };

    const hasValidMarker = (position) => {
        return guideState.targetsMarkerState[position[0]][position[1]] === 'L';
    };

    // select a square on click
    const selectSquare = (position) => {
        if((guideState.selctionState === 0) && (gameCondition === GameUtils.GAME_CONDITION.USER_PLAY) && isPieceCurrentPlayer(position)) {
            setGuideState(abaloneUtils.getGuideStateAfterFirstSelection(_.cloneDeep(gameState), position));
        } else if (guideState.selctionState === 1 && hasValidMarker(position)) {
            setGuideState(abaloneUtils.getGuideStateAfterSecondSelection(_.cloneDeep(gameState), guideState.selectedPositions[0], position))
        } else if(guideState.selctionState === 2 && hasValidMarker(position)){
            const moveDict = {
                firstSelection: guideState.selectedPositions.at(0),
                secondSelection: guideState.selectedPositions.at(-1),
                targetPosition: position
            };
            executeMove(moveDict);
        } else {
            setGuideState(abaloneUtils.getInitialGuideState())
        }
    };

    const gridSize = 2*AbaloneUtils.EDGE_SIZE - 1
    const rows = []
    for (let i = 0; i < gridSize; i++) {
        const hexagons = []
        for (let j = 0; j < gridSize; j++) {
            console.log(guideState)
            let isPieceSelected = guideState.selectedPositions.some(pos => pos[0]===i && pos[1]===j);
            hexagons.push(
                <Hexagon
                    key={j}
                    position={[i, j]}
                    hexGameState={gameState[i][j]}
                    hexMarkerState={guideState.targetsMarkerState[i][j]}
                    isPieceSelected={isPieceSelected}
                    selectSquare = {selectSquare}
                />
            );
        }
        const rowName = i===0 ? "board-row" : i%2 === 1 ? "board-row offset-hor" : "board-row offset-ver"
        rows.push(
            <div className={rowName} key={i}>
                {hexagons}
            </div>
        );
    }

    const eliminations = abaloneUtils.getEliminationCounts(gameState)
    const life = {
        'B': gameSize + 1 - eliminations['B'],
        'W': gameSize + 1 - eliminations['W']
    }

    const boardClass = (gameSize%2===0) ? 'board-even': 'board-odd';
    return (
        <div style={{ verticalAlign: "middle" }}>
            <div className="hexagon-container">
                <div className="hexagon-border outer"></div>
                <div className="hexagon-border"></div>
                <div className={boardClass}>
                    {rows}
                </div>
            </div>
            <div style={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:'20px'
                }}>

                <div className='info-container info-life'>
                    <FaHeart style={{color: "gray"}} /> &nbsp;<span style={{color: "rgb(230, 230, 230)"}}>{life['W']}</span>&nbsp;<span style={{color: "black"}}>{life['B']}</span>
                </div>
                    
                <div className='info-container'>
                    <button
                        className={(gameSize===4) ? 'box box-abalone selected' : 'box box-abalone'}
                        disabled={gameCondition !== GameUtils.GAME_CONDITION.OFF}
                        onClick={sizeButtonClick.FOUR}>
                        4
                    </button>
                    <button
                        className={(gameSize===5) ? 'box box-abalone selected' : 'box box-abalone'}
                        disabled={gameCondition !== GameUtils.GAME_CONDITION.OFF}
                        onClick={sizeButtonClick.FIVE}>
                        5
                    </button>
                    <button
                        className={(gameSize===6) ? 'box box-abalone selected' : 'box box-abalone'}
                        disabled={gameCondition !== GameUtils.GAME_CONDITION.OFF}
                        onClick={sizeButtonClick.SIX}>
                        6
                    </button>
                </div>
            </div>
        </div>
    );
}