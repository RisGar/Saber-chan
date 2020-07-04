"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const websocket_1 = __importDefault(require("./websocket/websocket"));
const logger_1 = __importDefault(require("./websocket/logs/logger"));
const date_1 = __importDefault(require("./date"));
const addExp_1 = __importDefault(require("./exp/addExp"));
// Import * as renderSass from "./websocket/renderSass";
const config_json_1 = require("./config.json");
const client = new discord_js_1.default.Client();
// Optional: Render SASS file into CSS
// Start Websocket
const webSocket = new websocket_1.default(config_json_1.webtoken, config_json_1.webport, client);
client.commands = new discord_js_1.default.Collection();
const commandFiles = fs_1.default.readdirSync(path_1.default.join(__dirname, "commands")).filter((file) => {
    return file.endsWith(".js");
});
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
client.login(config_json_1.token);
client.once("ready", () => {
    const readyLogger = new logger_1.default(1, "Ready!");
    /* Client.guilds.cache
      .get(mainServerId)
      .channels.cache.get(mainChannelId)
      .send("Saber-chan online!");*/
});
// eslint-disable-next-line prefer-arrow-callback
client.on("message", function (message) {
    addExp_1.default(message, message.author);
    if (!message.content.startsWith(config_json_1.prefix) || message.author.bot)
        return;
    const args = message.content.slice(config_json_1.prefix.length).split(" ");
    const commandName = args.shift().toLowerCase();
    if (!client.commands.has(commandName))
        return;
    const command = client.commands.get(commandName);
    if (command.guildOnly && message.channel.type !== "text") {
        return message.channel.send("Sorry, I can't execute that command inside DMs :(");
    }
    if (command.ownerOnly && !config_json_1.ownerId.includes(message.author.id)) {
        return message.channel.send("Sorry, this command is owner only :(");
    }
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config_json_1.prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    try {
        command.execute(message, args);
        const x = new date_1.default();
        fs_1.default.appendFile(path_1.default.join(path_1.default.dirname(__dirname), "src", "websocket", "public", "logs.txt"), `${x.fullTime}: ${message}\n`, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    catch (err) {
        console.log(err);
        message.reply("Sorry, there was an error trying to execute that command\nPlease try again later or contact vme");
    }
    return true;
});
