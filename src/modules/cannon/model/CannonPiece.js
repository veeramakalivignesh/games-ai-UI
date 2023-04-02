import CannonUtils from "../CannonUtils";

class CannonPiece {

    constructor(rearEnd, frontEnd) {
        this.rearEnd = rearEnd;
        this.frontEnd = frontEnd;
    }

    getMoveTargets() {
        const moveTargets = [];

        // move 1 step front
        let offset = CannonUtils.multiplyPositionWithScalar(0.5,
            CannonUtils.substractPositions(this.frontEnd, this.rearEnd));
        let moveTarget = CannonUtils.addPositions(this.frontEnd, offset)
        if (CannonUtils.isPositionValid(moveTarget)) {
            moveTargets.push(moveTarget);
        }

        return moveTargets;
    }

    getBombTargets() {
        const bombTargets = [];

        // shoot 2 steps front
        let offset = CannonUtils.substractPositions(this.frontEnd, this.rearEnd);
        let bombTarget = CannonUtils.addPositions(this.frontEnd, offset)
        if (CannonUtils.isPositionValid(bombTarget)) {
            bombTargets.push(bombTarget);
        }
        
        // shoot 3 steps front
        offset = CannonUtils.multiplyPositionWithScalar(1.5,
            CannonUtils.substractPositions(this.frontEnd, this.rearEnd));
        bombTarget = CannonUtils.addPositions(this.frontEnd, offset)
        if (CannonUtils.isPositionValid(bombTarget)) {
            bombTargets.push(bombTarget);
        }

        // shoot 2 steps back
        offset = CannonUtils.substractPositions(this.rearEnd, this.frontEnd);
        bombTarget = CannonUtils.addPositions(this.rearEnd, offset)
        if (CannonUtils.isPositionValid(bombTarget)) {
            bombTargets.push(bombTarget);
        }
        
        // shoot 3 steps back
        offset = CannonUtils.multiplyPositionWithScalar(1.5,
            CannonUtils.substractPositions(this.rearEnd, this.frontEnd));
        bombTarget = CannonUtils.addPositions(this.rearEnd, offset)
        if (CannonUtils.isPositionValid(bombTarget)) {
            bombTargets.push(bombTarget);
        }

        return bombTargets;
    }

}

export default CannonPiece;