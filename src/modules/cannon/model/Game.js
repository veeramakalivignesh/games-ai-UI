import CannonUtils from "../CannonUtils";
import CannonPiece from "./CannonPiece";

class Game {

    constructor(gameState) {
        this.state = gameState;
    }

    getPiece(position) {
        return this.state[position[0]][position[1]];
    }

    updatePiece(position, piece) {
        this.state[position[0]][position[1]] = piece;
    }

    isEmpty(postion) {
        return this.getPiece(postion) === 'E';
    }

    isBlackPiece(position) {
        return this.getPiece(position) === 'B';
    }

    isWhitePiece(position) {
        return this.getPiece(position) === 'W';
    }

    areOpponents(position0, position1) {
        return (
            (this.isBlackPiece(position0) && this.isWhitePiece(position1)) ||
            (this.isWhitePiece(position0) && this.isBlackPiece(position1))
        );
    }

    cannonExists(rearEnd, frontEnd) {
        const rearPiece = this.getPiece(rearEnd);
        const frontPiece = this.getPiece(frontEnd);
        const middlePiece = this.getPiece(CannonUtils.multiplyPositionWithScalar(0.5,
            CannonUtils.addPositions(rearEnd, frontEnd)));

        return ((rearPiece === 'B' || rearPiece === 'W') &&
            frontPiece === rearPiece &&
            middlePiece === rearPiece);
    }

    getCannonsWithRearPosition(position) {
        const cannons = [];
        const piece = this.getPiece(position);
        const rearEnd = position;

        // check right
        let frontEnd = CannonUtils.addPositions(rearEnd, [0, 2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check left
        frontEnd = CannonUtils.addPositions(rearEnd, [0, -2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check bottom
        frontEnd = CannonUtils.addPositions(rearEnd, [2, 0]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check top
        frontEnd = CannonUtils.addPositions(rearEnd, [-2, 0]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check bottom right
        frontEnd = CannonUtils.addPositions(rearEnd, [2, 2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check bottom left
        frontEnd = CannonUtils.addPositions(rearEnd, [2, -2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check top right
        frontEnd = CannonUtils.addPositions(rearEnd, [-2, 2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check top left
        frontEnd = CannonUtils.addPositions(rearEnd, [-2, -2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }
        
        return cannons;
    }

    getCannonsWithMiddlePosition(position) {
        const cannons = [];
        const piece = this.getPiece(position);

        // check horizontal
        let frontEnd = CannonUtils.addPositions(position, [0, 1]);
        let rearEnd = CannonUtils.addPositions(position, [0, -1]);
        if (CannonUtils.isPositionValid(frontEnd) && CannonUtils.isPositionValid(rearEnd)
            && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check vertical
        frontEnd = CannonUtils.addPositions(position, [-1, 0]);
        rearEnd = CannonUtils.addPositions(position, [1, 0]);
        if (CannonUtils.isPositionValid(frontEnd) && CannonUtils.isPositionValid(rearEnd)
            && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check positive diagonal
        frontEnd = CannonUtils.addPositions(position, [-1, 1]);
        rearEnd = CannonUtils.addPositions(position, [1, -1]);
        if (CannonUtils.isPositionValid(frontEnd) && CannonUtils.isPositionValid(rearEnd)
            && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }

        // check negative digonal
        frontEnd = CannonUtils.addPositions(position, [1, 1]);
        rearEnd = CannonUtils.addPositions(position, [-1, -1]);
        if (CannonUtils.isPositionValid(frontEnd) && CannonUtils.isPositionValid(rearEnd)
            && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd, piece));
        }
        
        return cannons;
    }

    getCannonMoveTargets(cannons) {
        let moveTargets = [];
        for (let cannon of cannons) {
            moveTargets = moveTargets.concat(cannon.getMoveTargets(this));
        }
        return moveTargets;
    }

    getBombTargets(cannons) {
        let bombTargets = [];
        for (let cannon of cannons) {
            bombTargets = bombTargets.concat(cannon.getBombTargets(this));
        }
        return bombTargets;
    }

    getSoldierMoveTargets(position) {
        const piece = this.getPiece(position);
        if (piece !== 'B' && piece !== 'W') {
            return [];
        }

        const moveTargets = [];
        const forwardOffset = this.isBlackPiece(position) ? -1 : 1;

        // move 1 step forward
        let moveTarget = CannonUtils.addPositions(position, [forwardOffset, 0])
        if (CannonUtils.isPositionValid(moveTarget) && (this.isEmpty(moveTarget) ||
            this.areOpponents(position, moveTarget))) {
            moveTargets.push(moveTarget);
        }

        // move 1 step along diagonals
        moveTarget = CannonUtils.addPositions(position, [forwardOffset, 1])
        if (CannonUtils.isPositionValid(moveTarget) && (this.isEmpty(moveTarget) ||
            this.areOpponents(position, moveTarget))) {
            moveTargets.push(moveTarget);
        }

        moveTarget = CannonUtils.addPositions(position, [forwardOffset, -1])
        if (CannonUtils.isPositionValid(moveTarget) && (this.isEmpty(moveTarget) ||
            this.areOpponents(position, moveTarget))) {
            moveTargets.push(moveTarget);
        }

        // capture 1 step horizontally 
        moveTarget = CannonUtils.addPositions(position, [0, 1])
        if (CannonUtils.isPositionValid(moveTarget) && this.areOpponents(position, moveTarget)) {
            moveTargets.push(moveTarget);
        }

        moveTarget = CannonUtils.addPositions(position, [0, -1])
        if (CannonUtils.isPositionValid(moveTarget) && this.areOpponents(position, moveTarget)) {
            moveTargets.push(moveTarget);
        }

        return moveTargets;
    }
    
    getStateAfterMove(selectedPosition, targetPosition) {
        const piece = this.getPiece(selectedPosition);
        this.updatePiece(selectedPosition, 'E');
        this.updatePiece(targetPosition, piece);
        return this.state;
    }

    getStateAfterBomb(targetPosition) {
        this.updatePiece(targetPosition, 'E');
        return this.state;
    }
}

export default Game;