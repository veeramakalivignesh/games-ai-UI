import "../Cannon.css";

// move guides
function Guide({ isDark }) {
  return (
    <button className={isDark ? 'dot guide-dark' : 'dot guide-red'} />
  );
}

// soldiers and townhalls
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

// one square in the grid
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
export default Square;