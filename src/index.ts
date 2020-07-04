/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import Discord from "discord.js";
import fs from "fs";
import path from "path";
import date from "./date";
import addExp from "./exp/addExp";
import logger from "./websocket/logs/logger";
import WebSocket from "./websocket/websocket";
// Import * as renderSass from "./websocket/renderSass";

import {
  mainChannelId,
  mainServerId,
  ownerId,
  prefix,
  token,
  webport,
  webtoken
} from "./config.json";

export {};

const client: any = new Discord.Client();

// Optional: Render SASS file into CSS

// Start Websocket
const webSocket = new WebSocket(webtoken, webport, client);

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter((file) =>
  file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.login(token);

client.once("ready", () => {
  const readyLogger = new logger(1, "Ready!");
  /* Client.guilds.cache
    .get(mainServerId)
    .channels.cache.get(mainChannelId)
    .send("Saber-chan online!");*/
});

// Eslint-disable-next-line prefer-arrow-callback
client.on("message", function (message) {

  addExp(message, message.author);

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.guildOnly && message.channel.type !== "text") {
    return message.channel.send(
      "Sorry, I can't execute that command inside DMs :("
    );
  }

  if (command.ownerOnly && !ownerId.includes(message.author.id)) {
    return message.channel.send("Sorry, this command is owner only :(");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  try {
    command.execute(message, args);

    const x = new date();

    fs.appendFile(
      path.join(path.dirname(__dirname),"src", "websocket", "public", "logs.txt"),
      `${x.fullTime}: ${message}\n`,
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  } catch (err) {
    console.log(err);
    message.reply(
      "Sorry, there was an error trying to execute that command\nPlease try again later or contact vme"
    );
  }
  return true;
});
