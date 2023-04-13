import CannonUtils from "../CannonUtils";

class CannonPiece {

    constructor(rearEnd, frontEnd, color) {
        this.rearEnd = rearEnd;
        this.frontEnd = frontEnd;
        this.color = color;
    }

    isTargetOpponent(game, position) {
        if(this.color === 'B') {
            return game.isWhitePiece(position);
        } else {
            return game.isBlackPiece(position);
        }
    }

    getMoveTargets(game) {
        const moveTargets = [];

        // move 1 step front
        let offset = CannonUtils.multiplyPositionWithScalar(0.5,
            CannonUtils.substractPositions(this.frontEnd, this.rearEnd));
        let moveTarget = CannonUtils.addPositions(this.frontEnd, offset)
        if (CannonUtils.isPositionValid(moveTarget) && game.isEmpty(moveTarget)) {
            moveTargets.push(moveTarget);
        }

        return moveTargets;
    }

    getBombTargets(game) {
        let offset = CannonUtils.multiplyPositionWithScalar(0.5,
            CannonUtils.substractPositions(this.frontEnd, this.rearEnd));
        let immediateFront = CannonUtils.addPositions(this.frontEnd, offset);
        const isFrontBlocked = (CannonUtils.isPositionValid(immediateFront) &&
            !game.isEmpty(immediateFront));

        offset = CannonUtils.multiplyPositionWithScalar(0.5,
            CannonUtils.substractPositions(this.rearEnd, this.frontEnd));
        let immediateBack = CannonUtils.addPositions(this.rearEnd, offset);
        const isBackBlocked = (CannonUtils.isPositionValid(immediateBack) &&
            !game.isEmpty(immediateBack));

        const bombTargets = [];
        if (!isFrontBlocked) {
            // shoot 2 steps front
            offset = CannonUtils.substractPositions(this.frontEnd, this.rearEnd);
            let bombTarget = CannonUtils.addPositions(this.frontEnd, offset)
            if (CannonUtils.isPositionValid(bombTarget) && (this.isTargetOpponent(game, bombTarget) ||
                game.isEmpty(bombTarget))) {
                bombTargets.push(bombTarget);
            }

            // shoot 3 steps front
            offset = CannonUtils.multiplyPositionWithScalar(1.5,
                CannonUtils.substractPositions(this.frontEnd, this.rearEnd));
            bombTarget = CannonUtils.addPositions(this.frontEnd, offset)
            if (CannonUtils.isPositionValid(bombTarget) && (this.isTargetOpponent(game, bombTarget) ||
                game.isEmpty(bombTarget))) {
                bombTargets.push(bombTarget);
            }
        }
        if (!isBackBlocked) {
            // shoot 2 steps back
            offset = CannonUtils.substractPositions(this.rearEnd, this.frontEnd);
            let bombTarget = CannonUtils.addPositions(this.rearEnd, offset)
            if (CannonUtils.isPositionValid(bombTarget) && (this.isTargetOpponent(game, bombTarget) ||
                game.isEmpty(bombTarget))) {
                bombTargets.push(bombTarget);
            }

            // shoot 3 steps back
            offset = CannonUtils.multiplyPositionWithScalar(1.5,
                CannonUtils.substractPositions(this.rearEnd, this.frontEnd));
            bombTarget = CannonUtils.addPositions(this.rearEnd, offset)
            if (CannonUtils.isPositionValid(bombTarget) && (this.isTargetOpponent(game, bombTarget) ||
                game.isEmpty(bombTarget))) {
                bombTargets.push(bombTarget);
            }
        }

        return bombTargets;
    }

}

export default CannonPiece;