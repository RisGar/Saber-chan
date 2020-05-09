"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const logger_1 = __importDefault(require("../websocket/logs/logger"));
const index_1 = __importDefault(require("../voice-rss-tts/index"));
module.exports = {
    name: "vcsay",
    description: "Say something in TTS powered by http://www.voicerss.org and send it to VC",
    args: true,
    execute(message, args) {
        const FileTtsRequest = new index_1.default(message);
        const playFile = async () => {
            const vc = await message.member.voice.channel.join();
            const dispatcher = vc.play("http://localhost:8081/");
            dispatcher.on("finish", () => {
                const sayingMsginVCWsLogger = new logger_1.default(1, `Saying "${message}" in channel "${message.member.voice.channel.name}" (Websocket)`);
                vc.disconnect();
                const { fileServer } = FileTtsRequest;
                http_1.default.get("http://localhost:8081/", () => {
                    fileServer.close();
                });
            });
        };
        playFile();
    },
};
