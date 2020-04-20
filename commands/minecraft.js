const logger = require("../websocket/logs/logger");

module.exports = {
  name: "minecraft",
  description: "Minecraft Server Online Status",
  args: true,
  usage: "<server ip> <server port (optional)>",
  execute(message, args) {
    const request = require("request");

    const mcIP = args[0];
    const mcPort = 25565;

    loadServerData();

    function loadServerData() {
      const url = `http://mcapi.us/server/status?ip=${mcIP}&port=${mcPort}`;
      request(url, function(err, response, body) {
        if (err) {
          new logger(3, err);
          return message.reply(
            "Error getting Minecraft server status... \nPlease specify a valid server name or ip",
          );
        }
        body = JSON.parse(body);
        let status = `${mcIP} is currently *offline* or not a valid server ip`;
        if (body.online == true && body.server.name != "§4● Offline") {
          status = `${mcIP} is **online** and `;
          if (body.players.now) {
            status += `${body.players.now} people are playing!`;
          }
 else {
            status += "*nobody is playing!*";
          }
        }
        message.reply(status);
      });
    }
  },
};
