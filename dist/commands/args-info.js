"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../websocket/logs/logger");
module.exports = {
    name: "args-info",
    description: "List all arguments the user has given to the bot",
    args: true,
    usage: '<arg>...',
    execute(message, args) {
        let i;
        for (i = 0; i < args.length; i++) {
            message.channel.send(`Argument: ${args[i]}`);
        }
    },
};
