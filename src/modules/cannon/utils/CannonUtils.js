import CannonGame from "../model/CannonGame";
import GameUtils from "../../../core/utils/GameUtils";
var _ = require('lodash');

/**
 * This class contians all util functions necassary for the UI
 * and other calculations for the Cannon game
 * 
 * @extends GameUtils
 * 
 * @author veeramakali.vignesh
 */

class CannonUtils extends GameUtils {

    static NUM_ROWS;
    static NUM_COLUMNS;

    static setSize(numRows, numColumns) {
        CannonUtils.NUM_ROWS = numRows;
        CannonUtils.NUM_COLUMNS = numColumns;
    }

    static isPositionValid(position) {
        return (position[0] >= 0 && position[0] < this.NUM_ROWS &&
            position[1] >= 0 && position[1] < this.NUM_COLUMNS);
    }

    static addPositions(positionA, positionB) {
        return [positionA[0] + positionB[0], positionA[1] + positionB[1]];
    }

    static substractPositions(positionA, positionB) {
        return [positionA[0] - positionB[0], positionA[1] - positionB[1]];
    }

    static multiplyPositionWithScalar(scalar, position) {
        return [scalar * position[0], scalar * position[1]];
    }

    static getRow(arrayUnit, numRepetitions) {
        let row = [];
        for (let i = 0; i < numRepetitions; i++) {
            row = row.concat(arrayUnit);
        }
        return row;
    }

    constructor() {
        super();
    }

    /**
     * Tw -> White Townhall
     * W -> White Soldier
     * E -> Empty
     * B -> Black Soldier
     * Tb -> Black Townhall
     * 
     * @override
     */
    getInitialGameState() {
        const initialGameState = [];

        // white townhalls and soldiers
        initialGameState.push(CannonUtils.getRow(['Tw', 'W'], CannonUtils.NUM_COLUMNS / 2));
        initialGameState.push(CannonUtils.getRow(['E', 'W'], CannonUtils.NUM_COLUMNS / 2));
        initialGameState.push(CannonUtils.getRow(['E', 'W'], CannonUtils.NUM_COLUMNS / 2));

        for (let i = 0; i < CannonUtils.NUM_ROWS - 6; i++) {
            initialGameState.push(CannonUtils.getRow(['E'], CannonUtils.NUM_COLUMNS));
        }

        // black townhalls and soldiers
        initialGameState.push(CannonUtils.getRow(['B', 'E'], CannonUtils.NUM_COLUMNS / 2));
        initialGameState.push(CannonUtils.getRow(['B', 'E'], CannonUtils.NUM_COLUMNS / 2));
        initialGameState.push(CannonUtils.getRow(['B', 'Tb'], CannonUtils.NUM_COLUMNS / 2));

        return initialGameState;
    }

    /**
     * N -> No Marker
     * D -> Dark Marker
     * R -> Red Marker
     *
     * @override
     */
    getInitialGuideState() {
        const initialGuideState = {
            targetsMarkerState: [],
            selectedPosition: null
        };
        for (let i = 0; i < CannonUtils.NUM_ROWS; i++) {
            initialGuideState.targetsMarkerState.push(CannonUtils.getRow(['N'], CannonUtils.NUM_COLUMNS));
        }
        return initialGuideState;
    }

    /**
     * @override
     */
    convertMoveStringToDict(move) {
        const moveDict = {
            type: move[6],
            selectedPosition: [parseInt(move[2]), parseInt(move[4])],
            targetPosition: [parseInt(move[8]), parseInt(move[10])]
        };
        return moveDict;
    }

    /**
     * @override
     */
    convertMoveDictToString(moveDict) {
        return "S " + moveDict.selectedPosition[0] + " " + moveDict.selectedPosition[1] + " " +
            moveDict.type + " " + moveDict.targetPosition[0] + " " + moveDict.targetPosition[1];
    }
    
    /**
     * gets a guide state after selection
     * 
     * @param {list} gameState 
     * @param {list} selectedPosition 
     */
    getGuideStateAfterSelection(gameState, selectedPosition) {
        const game = new CannonGame(gameState);
        const piece = game.getPiece(selectedPosition);
        if(piece  !== 'B' && piece !== 'W') {
            return this.getInitialGuideState();
        }

        // cannon moves
        const rearCannons = game.getCannonsWithRearPosition(selectedPosition);
        let moveTargets = game.getCannonMoveTargets(rearCannons);
        let bombTargets = game.getBombTargets(rearCannons);

        const middleCannons = game.getCannonsWithMiddlePosition(selectedPosition);
        bombTargets = bombTargets.concat(game.getBombTargets(middleCannons));

        // soldier moves
        moveTargets = moveTargets.concat(game.getSoldierMoveTargets(selectedPosition));

        const guideState = this.getInitialGuideState();
        for (let position of moveTargets) {
            guideState.targetsMarkerState[position[0]][position[1]] = 'D';
        }
        for (let position of bombTargets) {
            guideState.targetsMarkerState[position[0]][position[1]] = 'R';
        }
        guideState.selectedPosition = selectedPosition;

        return guideState;
    }

    /**
     * @override
     */
    isMoveValid(gameState, isBlackTurn, moveDict) {
        const currentPiece = isBlackTurn ? 'B' : 'W';
        if (!CannonUtils.isPositionValid(moveDict.selectedPosition) || !CannonUtils.isPositionValid(moveDict.targetPosition)) {
            return false;
        }
        if (gameState[moveDict.selectedPosition[0]][moveDict.selectedPosition[1]] !== currentPiece) {
            return false;
        }
        const guideState = this.getGuideStateAfterSelection(gameState, moveDict.selectedPosition);
        if (moveDict.type === 'M') {
            return guideState.targetsMarkerState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] === 'D';
        } else if (moveDict.type === 'B') {
            return guideState.targetsMarkerState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] === 'R';
        } else {
            return false;
        }
    }

    /**
     * @override
     */
    getGameStateAfterMove(gameState, moveDict) {
        const game = new CannonGame(gameState);

        if (moveDict.type === 'M') {
            return game.getStateAfterMove(moveDict.selectedPosition, moveDict.targetPosition);
        } else {
            return game.getStateAfterBomb(moveDict.targetPosition);
        }
    }

    /**
     * @override
     */
    getGameConditionIfOver(currentGameCondition, gameState, isBlackTurn) {
        let numBlackTownhalls = 0;
        let numWhiteTownhalls = 0;
        for (let row of gameState) {
            for (let square of row) {
                if (square === 'Tb') {
                    numBlackTownhalls++;
                }
                if (square === 'Tw') {
                    numWhiteTownhalls++;
                }
            }
        }
        if (numBlackTownhalls <= CannonUtils.NUM_COLUMNS / 2 - 2) {
            return GameUtils.GAME_CONDITION.WHITE_WINS;
        }
        if (numWhiteTownhalls <= CannonUtils.NUM_COLUMNS / 2 - 2) {
            return GameUtils.GAME_CONDITION.BLACK_WINS;
        }

        let soldier = isBlackTurn ? 'B' : 'W';
        for (let i = 0; i < CannonUtils.NUM_ROWS; i++) {
            for (let j = 0; j < CannonUtils.NUM_COLUMNS; j++) {
                if (gameState[i][j] === soldier) {
                    let newGuideState = this.getGuideStateAfterSelection(gameState, [i, j]);
                    if (JSON.stringify(newGuideState.targetsMarkerState) !== JSON.stringify(this.getInitialGuideState().targetsMarkerState)) {
                        return currentGameCondition;
                    }
                }
            }
        }

        return GameUtils.GAME_CONDITION.STALEMATE;
    }

    /**
     * @override
     */
    getGuideStateForMoveAnimation(moveDict) {
        const guideState = this.getInitialGuideState();
        if(moveDict.type==='M') {
            guideState.targetsMarkerState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] = 'D';
        } else {
            guideState.targetsMarkerState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] = 'R';
        }
        guideState.selectedPosition = moveDict.selectedPosition;
        return guideState;
    }
}

export default CannonUtils;