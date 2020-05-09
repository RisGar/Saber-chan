"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../websocket/logs/logger"));
module.exports = {
    name: "reload",
    description: "Reloads a command",
    ownerOnly: true,
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`No command passed, ${message.author}!`);
        }
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) ||
            message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            return message.channel.send(`No command named \`${commandName}\`, ${message.author}!`);
        }
        delete require.cache[require.resolve(`./${command.name}.js`)];
        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        }
        catch (error) {
            new logger_1.default(3, error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
        message.channel.send(`\`${command.name}\` was reloaded!`);
    },
};
