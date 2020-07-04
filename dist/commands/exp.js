"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
const discord_js_1 = __importDefault(require("discord.js"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expDb = require("../exp/expDb.json");
module.exports = {
    name: "exp",
    description: "Show your current level and your exp",
    execute(message, args) {
        const dbEntry = expDb[message.author.id];
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const expEmbed = new discord_js_1.default.MessageEmbed()
            .setColor("#00BFFF")
            .setAuthor("Your exp", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/TestScreen_square.svg/500px-TestScreen_square.svg.png")
            .addField("Your level: ", dbEntry.level)
            .addField("Your total exp: ", dbEntry.totalexp)
            .addField("Your exp:", dbEntry.exp)
            .setTimestamp()
            .setFooter("Saber-chan", "https://cdn.discordapp.com/avatars/629719032114970684/e619f816e4528964e907d369d28b63cc.jpg");
        message.channel.send(expEmbed);
    },
};
