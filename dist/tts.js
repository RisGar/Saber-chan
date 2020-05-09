"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/class-name-casing */
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./voice-rss-tts/index"));
const config_json_1 = require("./config.json");
class tts {
    constructor(text) {
        this.text = text;
        const fileServer = http_1.default
            .createServer((request, response) => {
            index_1.default({
                key: config_json_1.ttstoken,
                hl: "en-us",
                src: text,
                r: 0,
                c: "mp3",
                f: "44khz_16bit_stereo",
                ssml: false,
                b64: false,
                // eslint-disable-next-line object-shorthand
                callback: function (error, content) {
                    response.end(error || content);
                },
            });
        })
            .listen(8081);
        this.fileServer = fileServer;
    }
}
exports.default = tts;
