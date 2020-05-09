import request from "request";
import http from "http";
import fs from "fs";
import logger from "../websocket/logs/logger";
import { ttstoken } from "../config.json";
import tts from "../voice-rss-tts/index";

export {};

module.exports = {
  name: "say",
  description: "Say something in TTS powered by http://www.voicerss.org",
  args: true,
  execute(message, args) {
    const WSTtsRequest = new tts(message);

    const playFile = async () => {
      const file = fs.createWriteStream("tts.mp3");
      http.get("http://localhost:8081/", (response) => {
        response.pipe(file);
        file.on("finish", () => {
          message.channel.send({ files: ["tts.mp3"] });

          const { fileServer } = WSTtsRequest;

          fileServer.close();
        });
      });
    };

    playFile();
  },
};
