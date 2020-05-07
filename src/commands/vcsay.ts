const logger = require("../websocket/logs/logger");
const request = require("request");
const { ttstoken } = require("../config.json");
const tts = require("../voice-rss-tts/index.js");
const http = require("http");
const fs = require("fs");

module.exports = {
  name: "vcsay",
  description:
    "Say something in TTS powered by http://www.voicerss.org and send it to VC",
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

    /*const file = fs.createWriteStream("tts.mp3");
    http.get("http://localhost:8081/", function (response) {
      response.pipe(file);
      file.on("finish", async() => {

        if (!message.member.voice.channel){
            message.channel.send("No VC connceted");
        } 


        const vc = await message.member.voice.channel.join();

        const dispatcher = vc.play("tts.mp3")
        
        dispatcher.on("error", new logger(3, error));

        dispatcher.on('finish', () => {
	        dispatcher.destroy();
        });

        fileServer.close();
      });
    });*/

    const playFile = async () => {
      const vc = await message.member.voice.channel.join();

      const dispatcher = vc.play("http://localhost:8081/");

      dispatcher.on("finish", () => {
        new logger(
          1,
          `Saying "${args.join(" ")}" in channel "${chan.name}" (Command)`
        );
        vc.disconnect();

        http.get("http://localhost:8081/", function (response) {
          fileServer.close();
        });
      });
    };

    playFile();
  },
};
