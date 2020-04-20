const logger = require("./logs/logger");

module.exports = {
  name: "beep",
  description: "Beep!",
  args: false,
  execute(message) {
    message.channel.send("Boop!");
  },
};
