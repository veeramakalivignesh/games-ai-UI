import Game from "./model/Game";
var _ = require('lodash');

class CannonUtils {

    static NUM_ROWS = 8;
    static NUM_COLUMNS = 8;

    static INITIAL_GAME_STATE = [
        ['E', 'W', 'E', 'W', 'E', 'W', 'E', 'W'],
        ['E', 'W', 'E', 'W', 'E', 'W', 'W', 'W'],
        ['E', 'W', 'E', 'W', 'E', 'W', 'E', 'W'],
        ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
        ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
        ['B', 'E', 'B', 'E', 'B', 'E', 'B', 'E'],
        ['B', 'B', 'B', 'B', 'B', 'E', 'B', 'E'],
        ['B', 'E', 'B', 'E', 'B', 'E', 'B', 'E']
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

    static getGuideStateAfterSelection(gameState, selectedPosition) {
        const game = new Game(gameState);
        const piece = game.getPiece(selectedPosition);
        if(piece  !== 'B' && piece !== 'W') {
            return this.getInitialGameState();
        }

        const rearCannons = game.getCannonsWithRearPosition(selectedPosition);
        let moveTargets = game.getCannonMoveTargets(rearCannons);
        let bombTargets = game.getBombTargets(rearCannons);

        const middleCannons = game.getCannonsWithMiddlePosition(selectedPosition);
        bombTargets = bombTargets.concat(game.getBombTargets(middleCannons));

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
}

export default CannonUtils;