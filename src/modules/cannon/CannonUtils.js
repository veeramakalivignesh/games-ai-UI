import Game from "./model/Game";
var _ = require('lodash');

class CannonUtils {

    static NUM_ROWS = 8;
    static NUM_COLUMNS = 8;

    static GAME_CONDITION = {
        BLACK_WINS: "BLACK_WINS",
        WHITE_WINS: "WHITE_WINS",
        STALEMATE: "STALEMATE",
        ON: "ON",
        OFF: "OFF",
        REPLAY: "REPLAY"
    };

    static INITIAL_GAME_STATE = [
        ['Tw', 'W', 'Tw', 'W', 'Tw', 'W', 'Tw', 'W'],
        ['E', 'W', 'E', 'W', 'E', 'W', 'E', 'W'],
        ['E', 'W', 'E', 'W', 'E', 'W', 'E', 'W'],
        ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
        ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
        ['B', 'E', 'B', 'E', 'B', 'E', 'B', 'E'],
        ['B', 'E', 'B', 'E', 'B', 'E', 'B', 'E'],
        ['B', 'Tb', 'B', 'Tb', 'B', 'Tb', 'B', 'Tb']
    ];

    static INITIAL_GUIDE_STATE = [
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
        ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']
    ];

    static getInitialGameState() {
        return _.cloneDeep(this.INITIAL_GAME_STATE);
    }

    static getInitialGuideState() {
        return  _.cloneDeep(this.INITIAL_GUIDE_STATE);
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

    static convertMoveStringToDict(move) {
        const moveDict = {
            type: move[6],
            selectedPosition: [parseInt(move[2]), parseInt(move[4])],
            targetPosition: [parseInt(move[8]), parseInt(move[10])]
        };
        return moveDict;
    }

    static convertMoveDictToString(moveDict) {
        return "S " + moveDict.selectedPosition[0] + " " + moveDict.selectedPosition[1] + " " +
            moveDict.type + " " + moveDict.targetPosition[0] + " " + moveDict.targetPosition[1];
    }

    static getGuideStateAfterSelection(gameState, selectedPosition) {
        const game = new Game(gameState);
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
            guideState[position[0]][position[1]] = 'D';
        }
        for (let position of bombTargets) {
            guideState[position[0]][position[1]] = 'R';
        }
        
        return guideState;
    }

    static getGameStateAfterMove(gameState, moveDict) {
        const game = new Game(gameState);

        if (moveDict.type === 'M') {
            return game.getStateAfterMove(moveDict.selectedPosition, moveDict.targetPosition);
        } else {
            return game.getStateAfterBomb(moveDict.targetPosition);
        }
    }

    static getGameCondition(gameState, isBlackTurn) {
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
        if (numBlackTownhalls <= 2) {
            return this.GAME_CONDITION.WHITE_WINS;
        }
        if (numWhiteTownhalls <= 2) {
            return this.GAME_CONDITION.BLACK_WINS;
        }

        let soldier = isBlackTurn ? 'B' : 'W';
        for (let i = 0; i < this.NUM_ROWS; i++) {
            for (let j = 0; j < this.NUM_COLUMNS; j++) {
                if (gameState[i][j] === soldier) {
                    let newGuideState = this.getGuideStateAfterSelection(gameState, [i, j]);
                    if (JSON.stringify(newGuideState) !== JSON.stringify(this.getInitialGuideState())) {
                        return this.GAME_CONDITION.ON;
                    }
                }
            }
        }

        return this.GAME_CONDITION.STALEMATE;
    }

    static getGuideStateForMoveAnimation(moveDict) {
        const guideState = this.getInitialGuideState();
        if(moveDict.type==='M') {
            guideState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] = 'D';
        } else {
            guideState[moveDict.targetPosition[0]][moveDict.targetPosition[1]] = 'R';
        }
        return guideState;
    }
}

export default CannonUtils;