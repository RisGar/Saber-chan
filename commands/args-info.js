module.exports = {
  name: "args-info",
  description: "List all arguments the user has given to the bot",
  args: true,
  usage: '<arg>...',
  execute(message, args) {
    const command = client.commands.get(commandName);
    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  },
};
