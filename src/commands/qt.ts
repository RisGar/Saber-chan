import logger from "../websocket/logs/logger";

export {};

module.exports = {
  name: "qt",
  description: "Call Saber-chan a qt",
  args: false,
  execute(message) {
    message.channel.send(`no u, ${message.author}`);
  },
};
