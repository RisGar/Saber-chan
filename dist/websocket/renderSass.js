"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/class-name-casing */
const node_sass_1 = __importDefault(require("node-sass"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logs/logger"));
class renderSass {
    constructor() {
        this.render = () => {
            node_sass_1.default.render({
                file: path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), "src", "websocket", "sass", "main.scss"),
                outFile: path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), "src", "websocket", "public", "css", "main.css"),
            }, (error, result) => {
                if (!error) {
                    const main = result;
                    fs_1.default.writeFile(path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), "src", "websocket", "public", "css", "main.css"), main.css, (err) => {
                        if (!err) {
                            const cssWritten = new logger_1.default(1, "main.css has been written");
                        }
                        else {
                            const cssNotWritten = new logger_1.default(3, "main.css has not been written!");
                        }
                    });
                }
                else {
                    const cssNotWritten = new logger_1.default(3, "main.scss has not been read!");
                }
            });
        };
    }
}
exports.default = renderSass;
