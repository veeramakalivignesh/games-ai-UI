import axios from "axios";
import config from "../../resources/config.json";

/**
 * This is a super class for bot api clients
 * Any class that extends this must implement the below functions
 * 
 * @description contains api call funtions for the bot play mode
 * 
 * @author cant12
 */

class BotClient {

    static SERVER_URL = config.cannon.bot_server_url;

    constructor() { }

    healthCheckServer = async () => {
        const response = await axios({
            method: 'get',
            url: BotClient.SERVER_URL + '/health',
        }).catch((err) => {
            if (err.response) {
                alert("Server responded with a " + err.response.status + " bad response!");
            } else {
                alert("Server is offline!")
            }
        });
    }
    
    /**
     * calls backend api to fetch the primary bot move
     * 
     * @param {list} gameState 
     * @param {boolean} isBlackTurn
     * 
     * @returns {Promise<string>}
     */
    fetchPrimaryBotMove = async (gameState, isBlackTurn) => { 
        throw Error("This function is not implemented");
    }

    /**
     * calls backend api to fetch the secondary bot move
     * 
     * @param {list} gameState 
     * @param {boolean} isBlackTurn
     * 
     * @returns {Promise<string>}
     */
    fetchSecondaryBotMove = async (gameState, isBlackTurn) => { 
        throw Error("This function is not implemented");
    }

}

export default BotClient;