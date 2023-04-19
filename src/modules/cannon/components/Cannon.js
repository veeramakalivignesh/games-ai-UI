import "./Cannon.css";
import CannonUtils from '../utils/CannonUtils';
import Square from './CannonComponents';
import GameUtils from "../../../core/utils/GameUtils";
var _ = require('lodash');

// Cannon game board
export default function Cannon({ gameState, guideState, isBlackTurn, gameCondition, setGuideState, executeMove}) {
    const cannonUtils = new CannonUtils();

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
        <div style={{ borderStyle: 'outset', borderWidth: '10px' }}>
            {rows}
        </div>
    );
}