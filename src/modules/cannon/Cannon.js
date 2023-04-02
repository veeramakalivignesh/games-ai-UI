import { useState } from 'react';
import "./Cannon.css";
import CannonUtils from "./CannonUtils";
var _ = require('lodash');

function Guide({ isDark }) {
  return (
    <button className={isDark ? 'dot-dark' : 'dot-red'} />
  );
}

function Piece({ isSoldier, isBlack, hasGuide, isDarkGuide, selected }) {

  let pieceClass = "";
  if (isSoldier) {
    if (isBlack) {
      pieceClass = selected ? 'black-circle-selected' : 'black-circle';
    } else {
      pieceClass = selected ? 'white-circle-selected' : 'white-circle';
    }
  } else {
    pieceClass = isBlack ? 'black-townhall' : 'white-townhall'
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
      const moveType = isDarkGuide ? 'M' : 'B';
      executeMove(moveType, position);
    } else {
      selectSquare(position);
    }
  }

  return (
    <button
      className={dark ? "square-dark" : "square-light"}
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

export default function Board() {
  const [gameState, setGameState] = useState(CannonUtils.getInitialGameState());
  const [guideState, setGuideState] = useState(CannonUtils.getInitialGuideState());
  const [selectedPosition, setSelectedPosition] = useState(null);

  const selectSquare = (position) => {
    setSelectedPosition(position);
    setGuideState(CannonUtils.getGuideStateAfterSelection(_.cloneDeep(gameState), position));
  };

  const executeMove = (moveType, targetPosition) => {
    const moveDict = {
      type: moveType,
      selectedPosition: selectedPosition,
      targetPosition: targetPosition
    };
    setGameState(CannonUtils.getGameStateAfterMove(_.cloneDeep(gameState), moveDict));
    setGuideState(CannonUtils.getInitialGuideState())
    setSelectedPosition(null);
  }
  
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
      <div className="board-row">
        {squares}
      </div>
    );
  }

  return (
    <>
      {rows}
    </>
  );
}
