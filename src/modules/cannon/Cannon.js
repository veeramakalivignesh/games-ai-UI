import { useEffect, useState } from 'react';
import "./Cannon.css";
import CannonUtils from "./CannonUtils";
import Square from './CannonComponents';
var _ = require('lodash');

export default function Board({gameCondition, savedGameLog, setGameCondition, addMoveLog, resetParent}) {
  const [gameState, setGameState] = useState(CannonUtils.getInitialGameState());
  const [guideState, setGuideState] = useState(CannonUtils.getInitialGuideState());
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isBlackTurn, setBlackTurn] = useState(true);
  const [counter, setCounter] = useState(-1);

  const reset = () => {
    setGameState(CannonUtils.getInitialGameState());
    setGuideState(CannonUtils.getInitialGuideState());
    setSelectedPosition(null);
    setBlackTurn(true);
  };

  const isPieceCurrentPlayer = (position) => {
    return (isBlackTurn && gameState[position[0]][position[1]] === 'B') ||
      (!isBlackTurn && gameState[position[0]][position[1]] === 'W');
  }

  const selectSquare = (position) => {
    if (isPieceCurrentPlayer(position) && (gameCondition === CannonUtils.GAME_CONDITION.ON)) {
      setGuideState(CannonUtils.getGuideStateAfterSelection(_.cloneDeep(gameState), position));
      setSelectedPosition(position);
    } else {
      setGuideState(CannonUtils.getInitialGuideState());
      setSelectedPosition(null);
    }
  };

  const executeMove = (moveDict) => {
    if (gameCondition === CannonUtils.GAME_CONDITION.ON) {
      moveDict.selectedPosition = selectedPosition;
    }
    const newGameState = CannonUtils.getGameStateAfterMove(_.cloneDeep(gameState), moveDict);
    setGameState(newGameState);
    setGuideState(CannonUtils.getInitialGuideState());
    setSelectedPosition(null);
    setBlackTurn(!isBlackTurn);
    addMoveLog(CannonUtils.convertMoveDictToString(moveDict));

    const newGameCondition = CannonUtils.getGameCondition(newGameState, !isBlackTurn);
    if(newGameCondition !== CannonUtils.GAME_CONDITION.ON) {
      setGameCondition(newGameCondition);
    }
  }

  const animateMove = (moveDict) => {
    const delay = 500;
    setTimeout(() => {
      setGuideState(CannonUtils.getGuideStateForMoveAnimation(moveDict));
      setSelectedPosition(moveDict.selectedPosition);
    }, delay);

    setTimeout(() => {
      executeMove(moveDict);
      if(gameCondition === CannonUtils.GAME_CONDITION.REPLAY) {
        setCounter(counter + 1);
      }
    }, 2 * delay);
  };

  useEffect(() => {
    if (gameCondition === CannonUtils.GAME_CONDITION.OFF) {
      reset();
      setCounter(-1);
    } else if (gameCondition === CannonUtils.GAME_CONDITION.REPLAY) {
      reset();
      setCounter(0);
    } else if (CannonUtils.isGameOverCondition(gameCondition)) {
      setCounter(-1);
    }
  }, [gameCondition]);

  useEffect(() => {
    if (gameCondition === CannonUtils.GAME_CONDITION.REPLAY) {
      if (counter >= 0 && counter < savedGameLog.length) {
        const moveDict = CannonUtils.convertMoveStringToDict(savedGameLog[counter]);
        animateMove(moveDict);
      }
    } else if(gameCondition === CannonUtils.GAME_CONDITION.OFF) {
      reset();
      setCounter(-1);
      resetParent();
    }
  }, [counter]);
  
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
