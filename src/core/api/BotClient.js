class BotClient {

    constructor() { }

    /**
     * calls backend api to fetch the bot move
     * 
     * @param {list} gameState 
     * @param {boolean} isBlackTurn
     * 
     * @returns {Promise<string>}
     */
    fetchBotMove = async (gameState, isBlackTurn) => { }

}

export default BotClient;