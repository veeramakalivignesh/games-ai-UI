import "./Abalone.css";

function Piece({ isReal, isBlack, selected }) {

    let pieceClass;
    if (isReal) {
        if (isBlack) {
            pieceClass = selected ? 'piece piece-black piece-black-selected' : 'piece piece-black';
        } else {
            pieceClass = selected ? 'piece piece-white piece-white-selected' : 'piece piece-white';
        }
    } else {
        pieceClass = "piece trans"
    }

    return (
        <button className={pieceClass}/>
    );
}

function Hexagon({position, hexGameState, hexMarkerState, isPieceSelected, selectSquare}) {

    let disabled = hexGameState === 'F'
    let hasPiece = !disabled && hexGameState !== 'E';
    let isBlackPiece = hexGameState === 'B';
    let hexClass = disabled ? "hexagon transparent": hexMarkerState === 'L' ? "hexagon light": hexMarkerState === 'D' ? "hexagon dark" : "hexagon"

    function handleClick() {
        selectSquare(position)
    }
    return (
        <button
            className={hexClass}
            onClick={handleClick}
        >
            <Piece
                isReal={hasPiece}
                isBlack={isBlackPiece}
                selected={isPieceSelected}
            />
        </button>
    );
}

export default Hexagon;
