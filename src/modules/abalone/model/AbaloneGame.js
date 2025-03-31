import AbaloneUtils from "../utils/AbaloneUtils"
import AbaloneUnit from "./AbaloneUnit";

class AbaloneGame {

    constructor(gameState) {
        this.state = gameState;
    }

    getPiece(position, transformed=false) {
        if(transformed) {
            let originalPosition = AbaloneUtils.getOriginalPosition(position)
            return this.state[originalPosition[0]][originalPosition[1]];
        } else{
            return this.state[position[0]][position[1]];
        }
    }

    updatePiece(position, piece, transformed=false) {
        if(transformed) {
            let originalPosition = AbaloneUtils.getOriginalPosition(position)
            this.state[originalPosition[0]][originalPosition[1]] = piece;
        } else {
            this.state[position[0]][position[1]] = piece;
        }
    }

    isEmpty(position, transformed=false) {
        return this.getPiece(position, transformed) === 'E';
    }

    isForbidden(position, transformed=false) {
        return this.getPiece(position, transformed) === 'F';
    }

    isOpponent(position, color, transformed=false) {
        return (color==='B' && this.getPiece(position, transformed)==='W') ||
            (color==='W' && this.getPiece(position, transformed)==='B')
    }

    isSame(position, color, transformed=false) {
        return color===this.getPiece(position, transformed)
    }

    getUnitswithFirstPosition(position) {
        if (this.isEmpty(position)) {
            throw new Error("First Position Empty")
        }
        
        const units = []
        let color = this.getPiece(position)
        let positionT = AbaloneUtils.getTransformedPosition(position)

        units.push(new AbaloneUnit(positionT, null, 1, color))
        for(let dir of AbaloneUtils.directions) {
            let oneStep = AbaloneUtils.addVectors(positionT, dir)
            if(AbaloneUtils.isPositionValid(oneStep, true) && this.getPiece(oneStep, true)===color){
                units.push(new AbaloneUnit(positionT, dir, 2, color))
                let twoStep = AbaloneUtils.addVectors(oneStep, dir)
                if(AbaloneUtils.isPositionValid(twoStep, true) && this.getPiece(twoStep, true)===color){
                    units.push(new AbaloneUnit(positionT, dir, 3, color))
                }    
            }
        }
        return units
    }

    getTargetsForUnit(unit) {
        const targets = []
        for(let dir of AbaloneUtils.directions) {
            if (unit.isDirectionAlong(dir)) {
                let numOpponents = 0
                let posT =  unit.getNextPositionTforMove(dir)
                let flag = true
                while(true) {
                    if(AbaloneUtils.isPositionValid(posT, true)){
                        if(this.isOpponent(posT, unit.color, true)) {
                            numOpponents += 1
                        } else {
                            if ((numOpponents===0 && this.isForbidden(posT, true)) || this.isSame(posT, unit.color, true)) {
                                flag = false
                            }
                            break
                        }
                    } else {
                        if (numOpponents===0) {
                            flag = false
                        }
                        break
                    }
                    if(numOpponents >= unit.length) {
                        flag=false
                        break
                    }
                    posT = AbaloneUtils.addVectors(posT, dir)
                }
                if(flag) {
                    let targetPosT = AbaloneUtils.addVectors(unit.firstPositionT, dir)
                    targets.push(AbaloneUtils.getOriginalPosition(targetPosT))
                }

            } else {
                const unitPositionsT = unit.getAllPositions(true)
                let flag = true
                for(let posT of unitPositionsT) {
                    let newPosT = AbaloneUtils.addVectors(posT, dir)
                    if(!AbaloneUtils.isPositionValid(newPosT, true) || !this.isEmpty(newPosT, true)) {
                        flag = false
                        break
                    }
                }
                if(flag) {
                    targets.push(AbaloneUtils.getOriginalPosition(AbaloneUtils.addVectors(unitPositionsT[0], dir)))
                }
            }
        }
        return targets
    }

    getFirstTargets(firstPosition) {
        const targets = []
        const units = this.getUnitswithFirstPosition(firstPosition)
        for(let unit of units) {
            targets.push(unit.getSecondPostion())
        }
        return targets
    }

    getStateAfterMove(unit, dir) {
        if (unit.isDirectionAlong(dir)) {
            let posT =  unit.getNextPositionTforMove(dir)
            if(!this.isEmpty(posT, true)){
                while(true) {
                    if(!AbaloneUtils.isPositionValid(posT, true) || this.isForbidden(posT, true)) {
                        break
                    } else if (this.isEmpty(posT, true)) {
                        this.updatePiece(posT, AbaloneUtils.getOpponentColor(unit.color), true)
                        break
                    }
                    posT = AbaloneUtils.addVectors(posT, dir)
                }
            }
        }
        const unitPositionsT = unit.getAllPositions(true)
        for(let posT of unitPositionsT) {
            this.updatePiece(posT, 'E', true)
        }
        for(let posT of unitPositionsT) {
            console.log(posT)
            console.log(dir)
            console.log(AbaloneUtils.addVectors(posT, dir))
            this.updatePiece(AbaloneUtils.addVectors(posT, dir), unit.color, true)
        }
        return this.state;
    }
}

export default AbaloneGame;