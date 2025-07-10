import Client from "./client.js";
import { config } from '../daemon_conf.js'

const client = new Client(config.endpoint)
const methods = {
    // Generate blockchain address
    generateAddress: async (username = "") => {
        const response = await client.make_request(
            "getnewaddress",
            [username]
        );

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result;

    },
    // Move amount between accounts (DEPRECATED JSON-RPC API)
    moveAmount: async (fromUsername = "", toUsername = "", amount = 0) => {
        const response = await client.make_request(
            "move",
            [fromUsername, toUsername, amount]
        );

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result;
    },
    // Get account balance (DEPRECATED JSON-RPC API)
    getBalance: async (username = "") => {
        const response = await client.make_request(
            "getbalance",
            [username]
        );

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result;
    },
    // Withdraw amount from users account
    withdrawFrom: async (fromUsername = "", toAddress = "", amount = 0) => {
        const response = await client.make_request(
            "sendfrom",
            [fromUsername, toAddress, amount]
        );

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result;
    }
}

export default methods;