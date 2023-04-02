import CannonUtils from "../CannonUtils";
import CannonPiece from "./CannonPiece";

class Game {

    constructor(gameState) {
        this.state = gameState;
    }

    getPiece(position) {
        return this.state[position[0]][position[1]];
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

    getCannons(position) {
        const piece = this.getPiece(position);
        if (piece !== 'B' && piece !== 'W') {
            return [];
        }

        const cannons = [];
        const rearEnd = position;

        // check right
        let frontEnd = CannonUtils.addPositions(rearEnd, [0, 2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }

        // check left
        frontEnd = CannonUtils.addPositions(rearEnd, [0, -2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }

        // check bottom
        frontEnd = CannonUtils.addPositions(rearEnd, [2, 0]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }

        // check top
        frontEnd = CannonUtils.addPositions(rearEnd, [-2, 0]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }

        // check bottom right
        frontEnd = CannonUtils.addPositions(rearEnd, [2, 2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }

        // check bottom left
        frontEnd = CannonUtils.addPositions(rearEnd, [2, -2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }

        // check top right
        frontEnd = CannonUtils.addPositions(rearEnd, [-2, 2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }

        // check top left
        frontEnd = CannonUtils.addPositions(rearEnd, [-2, -2]);
        if (CannonUtils.isPositionValid(frontEnd) && this.cannonExists(rearEnd, frontEnd)) {
            cannons.push(new CannonPiece(rearEnd, frontEnd));
        }
        
        return cannons;
    }

    getMoveTargets(cannons, selectedPosition) {
        let isBlackCannon = (this.getPiece(selectedPosition) === 'B');

        let moveTargets = [];
        for (let cannon of cannons) {
            let possibleMoveTargets = cannon.getMoveTargets();
            for (let moveTarget of possibleMoveTargets) {
                if (isBlackCannon && this.getPiece(moveTarget) !== 'B') {
                    moveTargets.push(moveTarget);
                } else if (!isBlackCannon && this.getPiece(moveTarget) !== 'W') {
                    moveTargets.push(moveTarget);
                }
            }
        }
        return moveTargets;
    }

    getBombTargets(cannons, selectedPosition) {
        let isBlackCannon = (this.getPiece(selectedPosition) === 'B');

        let bombTargets = [];
        for (let cannon of cannons) {
            let possibleBombTargets = cannon.getBombTargets();
            for (let bombTarget of possibleBombTargets) {
                if (isBlackCannon && this.getPiece(bombTarget) !== 'B') {
                    bombTargets.push(bombTarget);
                } else if (!isBlackCannon && this.getPiece(bombTarget) !== 'W') {
                    bombTargets.push(bombTarget);
                }
            }
        }
        return bombTargets;
    }
    
}

export default Game;