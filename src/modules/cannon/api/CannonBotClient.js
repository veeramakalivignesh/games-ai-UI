import axios from "axios";
import BotClient from "../../../core/api/BotClient";

/**
 * This class contians apis to call the
 * CannonBot backend server
 * 
 * @extends BotClient
 * 
 * @author cant12
 */

class CannonBotClient extends BotClient {

    static URL = 'http://localhost:8000';

    constructor() { 
        super();
    }

    /**
     * @override
     */
    fetchPrimaryBotMove = async (gameState, isBlackTurn, forbiddenStates) => {
        const response = await axios({
            method: 'post',
            url: CannonBotClient.URL + '/primary/move',
            data: {
                'gameState': gameState,
                'isBlackTurn': isBlackTurn,
                'forbiddenStates': forbiddenStates
            }
        }).catch((err) => {
            if (err.response) {
                alert("Bot responded with a " + err.response.status + " bad response!");
            } else {
                alert("Bot is offline!")
            }
        });
        return response.data['move']
    }

    /**
     * @override
     */
    fetchSecondaryBotMove = async (gameState, isBlackTurn, forbiddenStates) => {
        const response = await axios({
            method: 'post',
            url: CannonBotClient.URL + '/secondary/move',
            data: {
                'gameState': gameState,
                'isBlackTurn': isBlackTurn,
                'forbiddenStates': forbiddenStates
            }
        }).catch((err) => {
            if (err.response) {
                alert("Bot responded with a " + err.response.status + " bad response!");
            } else {
                alert("Bot is offline!")
            }
        });
        return response.data['move']
    }

}

export default CannonBotClient;