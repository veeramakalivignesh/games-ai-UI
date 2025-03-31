import AbaloneUtils from "../utils/AbaloneUtils";

class AbaloneUnit {

    static fromPositions(firstPosition, secondPosition, color) {
        let firstPositionT = AbaloneUtils.getTransformedPosition(firstPosition)
        let secondPositionT = AbaloneUtils.getTransformedPosition(secondPosition)

        let direction = AbaloneUtils.substractVectors(secondPositionT, firstPositionT)
        let length = Math.floor((Math.abs(direction[0]) + Math.abs(direction[1]))/2) + 1
        
        if (length > 1){
            direction = AbaloneUtils.multiplyVectorWithScalar(1/(length-1), direction)
        } else {
            direction = null
        }
        return new AbaloneUnit(firstPositionT, direction, length, color)
    }

    constructor(firstPositionT, direction, length, color) {
        this.firstPositionT = firstPositionT;
        this.direction = direction;
        this.length = length
        this.color = color;
    }

    getSecondPostion() {
        let secondPositionT = null
        if (this.direction === null) {
            secondPositionT = this.firstPositionT
        } else {
            secondPositionT = AbaloneUtils.addVectors(this.firstPositionT, AbaloneUtils.multiplyVectorWithScalar(this.length-1, this.direction))
        }
        return AbaloneUtils.getOriginalPosition(secondPositionT)
    }

    getAllPositions(transformed=false) {
        const positions = []
        for(let i=0; i<this.length; i++) {
            let positionT;
            if(i===0) {
                positionT = this.firstPositionT
            } else {
                positionT = AbaloneUtils.addVectors(this.firstPositionT, AbaloneUtils.multiplyVectorWithScalar(i, this.direction))
            }
            if (transformed) {
                positions.push(positionT)
            } else {
                positions.push(AbaloneUtils.getOriginalPosition(positionT))
            }
        }
        return positions
    }

    isDirectionAlong(dir) {
        return (this.direction !== null) && ((dir[0]===this.direction[0] && dir[1]===this.direction[1]) ||
            (dir[0]===-this.direction[0] && dir[1]===-this.direction[1]))
    }

    getNextPositionTforMove(dir) {
        if(dir[0] === this.direction[0] && dir[1] === this.direction[1]) {
            return AbaloneUtils.addVectors(this.firstPositionT, AbaloneUtils.multiplyVectorWithScalar(this.length, dir))
        } else {
            return AbaloneUtils.addVectors(this.firstPositionT, dir)
        }
    }

}

export default AbaloneUnit;