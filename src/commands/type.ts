const logger = require("../websocket/logs/logger");

export {};

module.exports = {
    name: "type",
    description: "Types a message",
    args: true,
    usage: '<message>',
    execute(message, args) {

        new logger(1, `Sending message "${args.join(" ")}" to the channel "${message.channel.name}" (Command)`);
  
        message.channel.send(args.join(" "));
  
    },
  };