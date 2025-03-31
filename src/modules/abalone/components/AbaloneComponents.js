import "./Abalone.css";

function Piece({ isReal, isBlack, selected }) {

    let pieceClass = "circle";
    if (isReal) {
        if (isBlack) {
            pieceClass = selected ? 'circle black black-selected' : 'circle black';
        } else {
            pieceClass = selected ? 'circle white white-selected' : 'circle white';
        }
    } else {
        pieceClass = "circle trans"
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
