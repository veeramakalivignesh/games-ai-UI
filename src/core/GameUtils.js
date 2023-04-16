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
}

export default GameUtils;