"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../websocket/logs/logger");
module.exports = {
    name: "beep",
    description: "Beep!",
    args: false,
    execute(message) {
        message.channel.send("Boop!");
    },
};
