"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
class logger {
    constructor(level, message) {
        this.level = level;
        this.message = message;
        if (typeof level !== "number" || level > 3) {
            console.log("A wrong level has been given to the logger");
        }
        if (typeof message !== "string") {
            message = JSON.stringify(message);
        }
        const levels = ["", "[INFO]: ", "[WARN]: ", "[ERROR]: "];
        const now = Date.now();
        const dateZenbu = new Date(now);
        const dateNow = dateZenbu.getDate();
        const month = dateZenbu.getMonth() + 1;
        const year = dateZenbu.getFullYear();
        const hours = dateZenbu.getHours();
        const minutes = dateZenbu.getMinutes();
        const seconds = dateZenbu.getSeconds();
        const fullTime = `${dateNow}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        console.log(`${fullTime} ${levels[level]}${message}`);
    }
}
exports.default = logger;
