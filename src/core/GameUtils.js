class GameUtils {

    static GAME_CONDITION = {
        BLACK_WINS: "BLACK_WINS",
        WHITE_WINS: "WHITE_WINS",
        STALEMATE: "STALEMATE",
        PLAY: "PLAY",
        OFF: "OFF",
        REPLAY: "REPLAY"
    };

    static isGameOverCondition(gameCondition) {
        return (
            gameCondition === this.GAME_CONDITION.WHITE_WINS ||
            gameCondition === this.GAME_CONDITION.BLACK_WINS ||
            gameCondition === this.GAME_CONDITION.STALEMATE);
    }
}

export default GameUtils;