const logger = require("../websocket/logs/logger");

export {};

module.exports = {
  name: "args-info",
  description: "List all arguments the user has given to the bot",
  args: true,
  usage: '<arg>...',
  execute(message, args) {

    let i;

    for(i = 0; i < args.length; i++) {

      message.channel.send(`Argument: ${args[i]}`);

    }
  },
};
