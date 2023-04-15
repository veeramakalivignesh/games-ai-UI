import axios from "axios";

class CannonBotClient {

    static URL = "";

    static fetchBotMove = async (gameState, isBlackTurn) => {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8000/move',
            data: {
                'gameState': gameState,
                'isBlackTurn': isBlackTurn
            }
        });
        return response.data['move']
    }

}

export default CannonBotClient;