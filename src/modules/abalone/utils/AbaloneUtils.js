import GameUtils from "../../../core/utils/GameUtils";
import AbaloneGame from "../model/AbaloneGame";
import AbaloneUnit from "../model/AbaloneUnit";
var _ = require('lodash');

/**
 * This class contians all util functions necassary for the UI
 * and other calculations for the Cannon game
 * 
 * @extends GameUtils
 * 
 * @author veeramakali.vignesh
 */

class AbaloneUtils extends GameUtils {
    static EDGE_SIZE = 5;
    static directions = [[1,1], [0,2], [1,-1], [-1,1], [0,-2], [-1,-1]]

    // static isPositionValid(position, gameState) {
    //     const gridSize = 2*AbaloneUtils.EDGE_SIZE - 1
    //     return (position[0] >= 0 && position[0] < gridSize &&
    //         position[1] >= 0 && position[1] < gridSize && gameState[position[0]][position[1]] !== 'F');
    // }

    static isPositionValid(position, transformed=false) {
        let originalPosition = position
        if (transformed) {
            originalPosition = this.getOriginalPosition(position)
        }
    
        const gridSize = 2*AbaloneUtils.EDGE_SIZE - 1
        return (originalPosition[0] >= 0 && originalPosition[0] < gridSize &&
            originalPosition[1] >= 0 && originalPosition[1] < gridSize);
    }

    static getTransformedPosition(position) {
        if (position[0]%2 === 0) {
            return [position[0], 2*position[1]]
        } else {
            return [position[0], 2*position[1] + 1]
        }
    }

    static getOriginalPosition(positionT) {
        return [positionT[0], Math.floor(positionT[1]/2)]
    }

    static addVectors(vectorA, vectorB) {
        return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
    }

    static substractVectors(vectorA, vectorB) {
        return [vectorA[0] - vectorB[0], vectorA[1] - vectorB[1]];
    }

    static multiplyVectorWithScalar(scalar, vector) {
        return [scalar * vector[0], scalar * vector[1]];
    }

    static getOpponentColor(color) {
        if(color==='B') {
            return 'W';
        } else {
            return 'B'
        }
    }

    constructor() {
        super();
    }

    /**
     * W -> White Piece
     * E -> Empty
     * B -> Black Piece
     * F -> Forbidden
     * 
     * @override
     */
    getInitialGameState() {
        const gridSize = 2*AbaloneUtils.EDGE_SIZE - 1
        const initialOffset = AbaloneUtils.EDGE_SIZE - 1
        const initialGameState = []
        for (let i = 0; i < gridSize; i++) {
            let left_offset
            if (initialOffset%2 === 0) { 
                left_offset = Math.floor(Math.abs(initialOffset-i)/2)
            } else {
                left_offset = Math.ceil(Math.abs(initialOffset-i)/2)
            }
            let right_offset = Math.abs(initialOffset-i) - left_offset
            const row = []
            for (let j = 0; j < gridSize; j++) {
                if (j >= left_offset && j+right_offset < gridSize) {
                    if (i<2 || (i===2 && j >= left_offset+2 && j+right_offset+2 < gridSize)) {
                        row.push('W')    
                    } else if (i>gridSize-3 || (i===gridSize-3 && j >= left_offset+2 && j+right_offset+2 < gridSize)) {
                        row.push('B')
                    } else {
                        row.push('E')
                    }
                } else {
                    row.push('F')
                }
            }
            initialGameState.push(row)
        }

        return initialGameState
    }

  /**
     * N -> No Marker
     * L -> Light Marker
     * D -> Dark Marker
     *
     * @override
     */
    getInitialGuideState() {
        const gridSize = 2*AbaloneUtils.EDGE_SIZE - 1
        const initialGuideState = {
            targetsMarkerState: [],
            selctionState: 0,
            selectedPositions: []
        };
        for (let i = 0; i < gridSize; i++) {
            const row = []
            for(let j=0; j< gridSize; j++) {
                row.push('N')
            }
            initialGuideState.targetsMarkerState.push(row);
        }
        return initialGuideState;
    }

    /**
     * @override
     */
    convertMoveStringToDict(move) {
        const nums = move.split(" ")
        const moveDict = {
            firstSelection: [parseInt(nums[0]), parseInt(nums[1])],
            secondSelection: [parseInt(nums[2]), parseInt(nums[3])],
            targetPosition: [parseInt(nums[4]), parseInt(nums[5])]
        };
        return moveDict;
    }

    /**
     * @override
     */
    convertMoveDictToString(moveDict) {
        return moveDict.firstSelection[0] + " " + moveDict.firstSelection[1] + " " +
        moveDict.secondSelection[0] + " " + moveDict.secondSelection[1] + " " + 
        moveDict.targetPosition[0] + " " + moveDict.targetPosition[1];
    }

    /**
     * gets a guide state after first selection
     * 
     * @param {list} gameState 
     * @param {list} firstSelection
     */
    getGuideStateAfterFirstSelection(gameState, firstSelection) {
        const game = new AbaloneGame(gameState);
        const targets = game.getFirstTargets(firstSelection);
        const guideState = this.getInitialGuideState();
        for(let pos of targets) {
            guideState.targetsMarkerState[pos[0]][pos[1]] = 'L';       
        }
        guideState.selectedPositions = [firstSelection];
        guideState.selctionState = 1;
        return guideState;
    }

    /**
     * gets a guide state after second selection
     * 
     * @param {list} gameState 
     * @param {list} firstSelection
     * @param {list} secondSelection 
     */
    getGuideStateAfterSecondSelection(gameState, firstSelection, secondSelection) {
        const game = new AbaloneGame(gameState);
        let color = game.getPiece(firstSelection);
        const unit = AbaloneUnit.fromPositions(firstSelection, secondSelection, color)

        const targets = game.getTargetsForUnit(unit);
        const guideState = this.getInitialGuideState();
        guideState.targetsMarkerState[firstSelection[0]][firstSelection[1]] = 'D'
        for(let pos of targets) {
            guideState.targetsMarkerState[pos[0]][pos[1]] = 'L';       
        }
        guideState.selectedPositions = unit.getAllPositions();
        guideState.selctionState = 2;
        return guideState;
    }

    /**
     * @override
     */
    isMoveValid(gameState, isBlackTurn, moveDict) {
        const color = isBlackTurn ? 'B' : 'W';
        const game = new AbaloneGame(gameState);
        if(!AbaloneUtils.isPositionValid(moveDict.firstSelection) || game.isForbidden(moveDict.firstSelection) ||
        !AbaloneUtils.isPositionValid(moveDict.secondSelection) || game.isForbidden(moveDict.secondSelection) ||
        !AbaloneUtils.isPositionValid(moveDict.targetPosition) || game.isForbidden(moveDict.targetPosition)) {
            return false;
        }
        let guideState = this.getGuideStateAfterFirstSelection(gameState, moveDict.firstSelection)
        if(guideState.targetsMarkerState[moveDict.secondSelection[0]][moveDict.secondSelection[1]] !== 'L') {
            return false;
        }
        guideState = this.getGuideStateAfterSecondSelection(gameState, moveDict.firstSelection, moveDict.secondSelection)
        if(guideState.targetsMarkerState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] !== 'L') {
            return false;
        }
        return true;
    }

    /**
     * @override
     */
    getGameStateAfterMove(gameState, moveDict) {
        const game = new AbaloneGame(gameState);
        let color = game.getPiece(moveDict.firstSelection);
        const unit = AbaloneUnit.fromPositions(moveDict.firstSelection, moveDict.secondSelection, color)
        const dir = AbaloneUtils.substractVectors(AbaloneUtils.getTransformedPosition(moveDict.targetPosition), 
        AbaloneUtils.getTransformedPosition(moveDict.firstSelection))
        return game.getStateAfterMove(unit, dir)
    }

    getEliminationCounts(gameState) {
        let total = AbaloneUtils.EDGE_SIZE*3 - 1
        let numBlack = 0
        let numWhite = 0
        for(let row of gameState) {
            for(let piece of row) {
                if(piece === 'B') {
                    numBlack += 1
                } else if(piece === 'W') {
                    numWhite += 1
                }
            }
        }
        return {'B': total - numBlack, 'W': total - numWhite}
    }

    /**
     * @override
     */
    getGameConditionIfOver(currentGameCondition, gameState, isBlackTurn) {
        let counts = this.getEliminationCounts(gameState)

        if(counts['B'] > AbaloneUtils.EDGE_SIZE) {
            return GameUtils.GAME_CONDITION.WHITE_WINS;
        } else if (counts['W'] > AbaloneUtils.EDGE_SIZE){
            return GameUtils.GAME_CONDITION.BLACK_WINS;
        } else{
            return currentGameCondition;
        }
    }

    /**
     * @override
     */
    getGuideStateForMoveAnimation(moveDict) {
        const unit = AbaloneUnit.fromPositions(moveDict.firstSelection, moveDict.secondSelection, 'E')

        const guideState = this.getInitialGuideState();
        guideState.targetsMarkerState[moveDict.firstSelection[0]][moveDict.firstSelection[1]] = 'D'
        guideState.targetsMarkerState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] = 'L'
        guideState.selectedPositions = unit.getAllPositions();
        guideState.selctionState = 2;
        return guideState
    }

}

export default AbaloneUtils;