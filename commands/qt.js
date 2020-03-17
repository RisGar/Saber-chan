module.exports = {
  name: "qt",
  description: "Call vme-chan a qt",
  args: false,
  execute(message) {
    message.channel.send(`no u, ${message.author}`);
  }
};
