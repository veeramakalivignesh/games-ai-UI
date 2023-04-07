import { useEffect, useState } from 'react';
import "./Cannon.css";
import CannonUtils from "./CannonUtils";
var _ = require('lodash');

function Guide({ isDark }) {
  return (
    <button className={isDark ? 'dot guide-dark' : 'dot guide-red'} />
  );
}

function Piece({ isSoldier, isBlack, hasGuide, isDarkGuide, selected }) {
  let pieceClass = "";
  if (isSoldier) {
    if (isBlack) {
      pieceClass = selected ? 'circle black black-selected' : 'circle black hollow';
    } else {
      pieceClass = selected ? 'circle white white-selected' : 'circle white hollow';
    }
  } else {
    pieceClass = isBlack ? 'townhall black' : 'townhall white'
  }

  return (
    <button
      className={pieceClass}
    >
      {hasGuide ? <Guide isDark={isDarkGuide} /> : null}
    </button>
  );
}

function Square({ position, squareGameState, squareGuideState, isSoldierSelected, selectSquare, executeMove }) {
  let dark = (position[0] + position[1]) % 2 === 1;
  let hasPiece = squareGameState !== 'E';
  let isBlackPiece = (squareGameState === 'B' || squareGameState === 'Tb');
  let isSoldier = (squareGameState === 'B' || squareGameState === 'W')
  let hasGuide = squareGuideState !== 'N';
  let isDarkGuide = squareGuideState === 'D';

  function handleClick() {
    if (hasGuide) {
      const moveDict = {
        type: isDarkGuide ? 'M' : 'B',
        selectedPosition: null,
        targetPosition: position
      };
      executeMove(moveDict);
    } else {
      selectSquare(position);
    }
  }

  return (
    <button
      className={dark ? "square dark" : "square light"}
      onClick={handleClick}
    >
      {
        hasPiece ?
          <Piece
            isSoldier={isSoldier}
            isBlack={isBlackPiece}
            hasGuide={hasGuide}
            isDarkGuide={isDarkGuide}
            selected={isSoldierSelected}
          />
          :
          <>
            {hasGuide ? <Guide isDark={isDarkGuide} /> : null}
          </>
      }
    </button>
  );
}

export default function Board({gameCondition, savedGameLog, setGameCondition, addMoveLog, setGameLog}) {
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
    return (gameCondition === CannonUtils.GAME_CONDITION.ON) && ((isBlackTurn && gameState[position[0]][position[1]] === 'B') ||
      (!isBlackTurn && gameState[position[0]][position[1]] === 'W'));
  }

  const selectSquare = (position) => {
    if (isPieceCurrentPlayer(position)) {
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
      setGameLog([]);
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
