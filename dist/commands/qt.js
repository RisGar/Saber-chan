"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../websocket/logs/logger");
module.exports = {
    name: "qt",
    description: "Call Saber-chan a qt",
    args: false,
    execute(message) {
        message.channel.send(`no u, ${message.author}`);
    },
};
