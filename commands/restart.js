module.exports = {
  name: "restart",
  description: "Restarting the bot",
  ownerOnly: true,
  args: false,
  execute(message) {
    message.channel.send("Restart initiated").then((msg) => {
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            msg.edit(`Restart in ${4 - i}`);
          }, i * 1000);
        }
      }, 1000);

      setTimeout(() => {
        msg.edit(`Restarting`);
      }, 5000);

      setTimeout(() => {
        // bot.restart();

      }, 6000);

    });
  },
};
