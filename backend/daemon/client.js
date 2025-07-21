import axios from "axios";

class Client {
    constructor(
        config
    ) {
        this.config = config;
    }

    async make_request(method, params = []) {
        const endpoint = `http://${this.config.user}:${this.config.pass}@${this.config.host}:${this.config.port}`;
        const data = JSON.stringify(
            {
                method: method,
                params: params,
                id: this.config.rid
            }
        )

        const response = await axios.post(
            endpoint,
            data
        );

        return response.data
    }
}

export default Client;
