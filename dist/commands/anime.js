"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const jikanjs_1 = __importDefault(require("jikanjs"));
module.exports = {
    name: "anime",
    description: "Search for an anime on MAL",
    args: true,
    usage: "<anime name>",
    execute(message, args) {
        jikanjs_1.default
            .search("anime", args.join(" "), 1, { limit: 1 })
            .then((response) => {
            // New logger(1, response);
            const myProcessedData = response.results.map((result) => {
                return {
                    mal_id: result.mal_id,
                    title: result.title,
                    episodes: result.episodes,
                    synopsis: result.synopsis,
                    url: result.url,
                    image_url: result.image_url,
                    type: result.type,
                    score: result.score,
                };
            });
            const animeEmbed = new discord_js_1.default.MessageEmbed()
                .setTitle(myProcessedData[0].title)
                .setURL(myProcessedData[0].url)
                .setDescription(myProcessedData[0].synopsis)
                .setThumbnail(myProcessedData[0].image_url)
                .addFields({
                name: "Episodes",
                value: myProcessedData[0].episodes,
                inline: true,
            }, {
                name: "Type",
                value: myProcessedData[0].type,
                inline: true,
            }, {
                name: "Score",
                value: myProcessedData[0].score,
                inline: true,
            })
                .setTimestamp()
                .setFooter("Saber-chan", "https://cdn.discordapp.com/avatars/629719032114970684/e619f816e4528964e907d369d28b63cc.jpg");
            message.channel.send(animeEmbed);
        })
            .catch((err) => {
            console.error(err);
            message.channel.send("Sorry your request couldn't be executed \nPlease try later or contact vme");
        });
    },
};
