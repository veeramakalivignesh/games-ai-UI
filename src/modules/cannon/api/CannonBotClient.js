import axios from "axios";

class CannonBotClient {

    static URL = "";

    static fetchBotMove = async () => {
        const response = await axios.get("http://localhost:8000/move");
        return response.data["move"]
    }

}

export default CannonBotClient;