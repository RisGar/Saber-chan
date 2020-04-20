const logger = require("../websocket/logs/logger");

module.exports = {
    name: "say",
    description: "Says a message",
    args: true,
    usage: '<message>',
    execute(message, args) {

        new logger(1, `Sending message "${args.join(" ")}" to the channel "${message.channel.name}" (Command)`);
  
        message.channel.send(args.join(" "));
  
    },
  };