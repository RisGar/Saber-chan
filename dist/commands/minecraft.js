"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../websocket/logs/logger");
const request = require("request");
module.exports = {
    name: "minecraft",
    description: "Minecraft Server Online Status",
    args: true,
    usage: "<server ip> <server port (optional)>",
    execute(message, args) {
        function loadServerData() {
            const url = `http://mcapi.us/server/status?ip=${mcIP}&port=${mcPort}`;
            request(url, (err, response, body) => {
                if (err) {
                    const mcErrorLogger = new logger(3, err);
                    return message.reply("Error getting Minecraft server status... \nPlease specify a valid server name or ip");
                }
                const data = JSON.parse(body);
                let status = `${mcIP} is currently *offline* or not a valid server ip`;
                if (data.online === true && data.server.name !== "§4● Offline") {
                    status = `${mcIP} is **online** and `;
                    if (data.players.now) {
                        status += `${data.players.now} people are playing!`;
                    }
                    else {
                        status += "*nobody is playing!*";
                    }
                }
                message.reply(status);
            });
        }
        const mcIP = args[0];
        const mcPort = 25565;
        loadServerData();
    },
};
