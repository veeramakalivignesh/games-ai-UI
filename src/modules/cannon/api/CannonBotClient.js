import axios from "axios";

class CannonBotClient {

    static URL = "";

    static fetchBotMove = async (lastMove) => {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8000/move',
            data: {
                'move': lastMove
            }
        });
        return response.data['move']
    }

}

export default CannonBotClient;