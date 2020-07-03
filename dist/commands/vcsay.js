"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const logger_1 = __importDefault(require("../websocket/logs/logger"));
const tts_1 = __importDefault(require("../tts"));
module.exports = {
    name: "vcsay",
    description: "Say something in TTS powered by http://www.voicerss.org and send it to VC",
    args: true,
    execute(message, args) {
        const FileTtsRequest = new tts_1.default(message);
        const playFile = async () => {
            const vc = await message.member.voice.channel.join();
            message.channel.send("Khai BAD");
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
