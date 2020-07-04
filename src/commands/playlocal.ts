import fs from "fs";
import http from "http";
import path from "path";
import request from "request";
import { ttstoken } from "../config.json";
import tts from "../tts";
import logger from "../websocket/logs/logger";

export {};

module.exports = {
  name: "playlocal",
  description: "Play files from the music folder",
  args: true,
  execute(message, args) {
    const playFile = async () => {
      const vc = await message.member.voice.channel.join();

      if (args.join(" ") === "stop") {
        vc.disconnect();
      } else {
        const fileS = fs
          .readdirSync(
            path.join(path.dirname(path.dirname(__dirname)), "music")
          )
          .filter((file) =>
            file.includes(args.join(" ")));

        console.log(fileS[0]);

        if (fileS) {
          const dispatcher = vc.play(`music/${fileS[0]}`);

          dispatcher.on("finish", () => {
            const sayingMsginVCWsLogger = new logger(
              1,
              `Playing "${fileS[0]}" in channel "${
                message.member.voice.channel.name
              }" (Command)`
            );
            vc.disconnect();
          });
        } else {
          vc.disconnect();
        }
      }
    };

    playFile();
  },
};
