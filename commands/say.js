const logger = require("../websocket/logs/logger");
const request = require("request");
const { ttstoken } = require("../config.json");
var tts = require("../voice-rss-tts/index.js");
var http = require("http");
const fs = require("fs");

module.exports = {
  name: "say",
  description: "Say something in TTS powered by http://www.voicerss.org",
  args: true,
  execute(message, args) {
    let fileServer = http
      .createServer(function (request, response) {
        tts.speech({
          key: ttstoken,
          hl: "en-us",
          src: args.join(" "),
          r: 0,
          c: "mp3",
          f: "44khz_16bit_stereo",
          ssml: false,
          b64: false,
          callback: function (error, content) {
            response.end(error || content);
          },
        });
      })
      .listen(8081);

    const file = fs.createWriteStream("tts.mp3");
    http.get("http://localhost:8081/", function (response) {
      response.pipe(file);
      file.on("finish", function () {
        message.channel.send("aaaa", { files: ["tts.mp3"] });
        fileServer.close();
      });
    });

  },
};
