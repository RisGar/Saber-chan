import logger from "../websocket/logs/logger";

export {};

module.exports = {
  name: "github",
  description: "Show link of Github repository",
  ownerOnly: true,
  args: false,
  execute(message) {
    message.channel.send("https://github.com/RisGar/vmeBOT");

    if (message.guild && message.guild.id == "671058041067798538") {
      message.channel.send("<:BAAASAAAAAKAAAAAAA:682622908551397432>");
    }
  },
};
