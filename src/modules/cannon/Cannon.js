import { useState } from 'react';
import "./Cannon.css"
import CanononUtils from "./cannon-utils"

function Guide({ isDark }) {
  return (
    <button className={isDark ? 'dot-dark' : 'dot-red'} />
  );
}

function Soldier({ isBlack, hasGuide, isDarkGuide, selected }) {

  let circleClass = "";
  if (isBlack) {
    circleClass = selected ? 'black-circle-selected' : 'black-circle';
  } else {
    circleClass = selected ? 'white-circle-selected' : 'white-circle';
  }

  return (
    <button
      className={circleClass}
    >
      {hasGuide ? <Guide isDark={isDarkGuide} /> : null}
    </button>
  );
}

function Square({ position, squareGameState, squareGuideState, isSoldierSelected, fun }) {

  let dark = (position[0] + position[1]) % 2 === 1;
  let hasSoldier = squareGameState !== 'E';
  let isBlackSoldier = squareGameState === 'B';
  let hasGuide = squareGuideState !== 'N';
  let isDarkGuide = squareGuideState === 'D';

  function handleClick() {
    fun(position);
  }

  return (
    <button
      className={dark ? "square-dark" : "square-light"}
      onClick={handleClick}
    >
      {
        hasSoldier ?
          <Soldier
            isBlack={isBlackSoldier}
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
  const [gameState, setGameState] = useState(CanononUtils.INITIAL_GAME_STATE);
  const [guideState, setGuideState] = useState(CanononUtils.INITIAL_GUIDE_STATE);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const select = (position) => {
    setSelectedPosition(position);
    let newGuideState = guideState;
    newGuideState[4][4] = 'R';
    setGuideState(newGuideState);
  };

  const rows = []
  for (let i = 0; i < 8; i++) {
    const squares = []
    for (let j = 0; j < 8; j++) {
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
          fun={select}
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
