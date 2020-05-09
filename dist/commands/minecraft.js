"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const logger_1 = __importDefault(require("../websocket/logs/logger"));
module.exports = {
    name: "minecraft",
    description: "Minecraft Server Online Status",
    args: true,
    usage: "<server ip> <server port (optional)>",
    execute(message, args) {
        function loadServerData() {
            const url = `http://mcapi.us/server/status?ip=${mcIP}&port=${mcPort}`;
            request_1.default(url, (err, response, body) => {
                if (err) {
                    const mcErrorLogger = new logger_1.default(3, err);
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
