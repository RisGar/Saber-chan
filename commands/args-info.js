module.exports = {
  name: "args-info",
  description: "List all arguments the user has given to the bot",
  args: true,
  usage: '<arg>...',
  execute(message, args) {
    for(i = 0; i < args.length; i++) {

      message.channel.send(`Argument: ${args[i]}`);

    }
  },
};
