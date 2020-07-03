"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../websocket/logs/logger"));
module.exports = {
    name: "playlocal",
    description: "Play files from the music folder",
    args: true,
    execute(message, args) {
        const playFile = async () => {
            const vc = await message.member.voice.channel.join();
            if (args.join(" ") === "stop") {
                vc.disconnect();
            }
            else {
                const fileS = fs_1.default
                    .readdirSync(path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), "music"))
                    .filter((file) => {
                    return file.includes(args.join(" "));
                });
                console.log(fileS[0]);
                if (fileS) {
                    const dispatcher = vc.play(`music/${fileS[0]}`);
                    dispatcher.on("finish", () => {
                        const sayingMsginVCWsLogger = new logger_1.default(1, `Playing "${fileS[0]}" in channel "${message.member.voice.channel.name}" (Command)`);
                        vc.disconnect();
                    });
                }
                else {
                    vc.disconnect();
                }
            }
        };
        playFile();
    },
};
