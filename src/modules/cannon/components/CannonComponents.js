import "./Cannon.css";

// move target markers
function Marker({ isDark }) {
    return (
        <button className={isDark ? 'dot marker-dark' : 'dot marker-red'} />
    );
}

// soldiers and townhalls
function Piece({ isSoldier, isBlack, hasMarker, isDarkMarker, selected }) {
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
            {hasMarker ? <Marker isDark={isDarkMarker} /> : null}
        </button>
    );
}

// one square in the grid
function Square({ position, squareGameState, squareMarkerState, isSoldierSelected, selectedPosition, selectSquare, executeMove }) {
    let dark = (position[0] + position[1]) % 2 === 1;
    let hasPiece = squareGameState !== 'E';
    let isBlackPiece = (squareGameState === 'B' || squareGameState === 'Tb');
    let isSoldier = (squareGameState === 'B' || squareGameState === 'W')
    let hasMarker = squareMarkerState !== 'N';
    let isDarkMarker = squareMarkerState === 'D';

    function handleClick() {
        if (hasMarker) {
            const moveDict = {
                type: isDarkMarker ? 'M' : 'B',
                selectedPosition: selectedPosition,
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
                        hasMarker={hasMarker}
                        isDarkMarker={isDarkMarker}
                        selected={isSoldierSelected}
                    />
                    :
                    <>
                        {hasMarker ? <Marker isDark={isDarkMarker} /> : null}
                    </>
            }
        </button>
    );
}
export default Square;