class GameUtils {

    static GAME_CONDITION = {
        BLACK_WINS: "BLACK_WINS",
        WHITE_WINS: "WHITE_WINS",
        STALEMATE: "STALEMATE",
        USER_PLAY: "USER_PLAY",
        BOT_PLAY: "BOT_PLAY",
        OFF: "OFF",
        REPLAY: "REPLAY",
        PAUSE: "PAUSE"
    };

    static GAME_MODE = {
        PLAYER_PLAYER: "PLAYER_PLAYER",
        BOT_PLAYER: "BOT_PLAYER",
        BOT_BOT: "BOT_BOT"
    };

    static isGameOverCondition(gameCondition) {
        return (
            gameCondition === this.GAME_CONDITION.WHITE_WINS ||
            gameCondition === this.GAME_CONDITION.BLACK_WINS ||
            gameCondition === this.GAME_CONDITION.STALEMATE);
    }

    constructor() { }

    /**
     * returns the initial gameState
     * 
     * @returns {list}
     */
    getInitialGameState() { }

    /**
     * returns the initial guideState, where there are no move guides
     * 
     * @returns {dict}
     */
    getInitialGuideState() { }

    /**
     * converts the given move string to move dict
     * 
     * @param {string} move 
     * @returns {dict}
     */
    convertMoveStringToDict(move) { }

    /**
     * converts the given move dict to move string
     * 
     * @param {dict} moveDict
     * @returns {string} 
     */
    convertMoveDictToString(moveDict) { }

    /**
     * checks if a given move is valid
     * 
     * @param {list} gameState 
     * @param {boolean} isBlackTurn 
     * @param {dict} moveDict
     * @returns {boolean} 
     */
    isMoveValid(gameState, isBlackTurn, moveDict) { }

    /**
     * gets the new gameState after the given move has been executed
     * 
     * @param {list} gameState 
     * @param {dict} moveDict 
     * @returns {list}
     */
    getGameStateAfterMove(gameState, moveDict) { }

    /**
     * checks if the game is over for the gameState and
     * returns the corresponding gameCondition
     * 
     * returns the current gameCondition if game is not over
     * 
     * @param {GameUtils.GAME_CONDITION} currentGameCondition 
     * @param {list} gameState 
     * @param {boolean} isBlackTurn 
     * @returns {GameUtils.GAME_CONDITION}
     */
    getGameConditionIfOver(currentGameCondition, gameState, isBlackTurn) { }

    /**
     * gets the guideState that meeds to be displayed
     * while animating a given move
     * 
     * @param {dict} moveDict
     * @returns {dict
     */
    getGuideStateForMoveAnimation(moveDict) { }
}

export default GameUtils;