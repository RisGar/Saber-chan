"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const tts_1 = __importDefault(require("../tts"));
module.exports = {
    name: "say",
    description: "Say something in TTS powered by http://www.voicerss.org",
    args: true,
    execute(message, args) {
        const WSTtsRequest = new tts_1.default(message);
        const playFile = async () => {
            const file = fs_1.default.createWriteStream("tts.mp3");
            http_1.default.get("http://localhost:8081/", (response) => {
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
