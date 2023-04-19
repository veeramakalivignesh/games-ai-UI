import axios from "axios";
import BotClient from "../../../core/api/BotClient";

class CannonBotClient extends BotClient {

    static URL = 'http://localhost:8000';

    constructor() { 
        super();
    }

    /**
     * @override
     */
    fetchBotMove = async (gameState, isBlackTurn) => {
        const response = await axios({
            method: 'post',
            url: CannonBotClient.URL + '/move',
            data: {
                'gameState': gameState,
                'isBlackTurn': isBlackTurn
            }
        });
        return response.data['move']
    }

}

export default CannonBotClient;