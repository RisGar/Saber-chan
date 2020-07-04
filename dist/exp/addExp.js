"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expDb = require("./expDb.json");
function addExp(message, author) {
    // eslint-disable-next-line prefer-destructuring
    const id = author.id;
    if (!expDb[id]) {
        expDb[id] = {
            exp: 0,
            totalexp: 0,
            level: 0,
        };
    }
    const newExp = Math.floor(Math.random() * 10 + 15);
    expDb[id].exp += newExp;
    expDb[id].totalexp += newExp;
    // eslint-disable-next-line no-restricted-properties
    const nextLvlExp = 5 * Math.pow(expDb[id].level, 2) + 50 * expDb[id].level + 100;
    if (expDb[id].exp >= nextLvlExp) {
        // eslint-disable-next-line operator-assignment
        expDb[id].exp = expDb[id].exp - nextLvlExp;
        expDb[id].level += 1;
        message.channel.send(`Congrats <@${id}> for reaching level **${expDb[id].level}**!`);
        return true;
    }
    const data = JSON.stringify(expDb, null, 4);
    fs_1.default.writeFile(path_1.default.join(__dirname, "expDb.json"), data, (err) => {
        if (err) {
            console.log(err);
        }
        // Console.log("Data:")
        // Console.log(data)
    });
    // Fs.writeFileSync("expDb.json", data)
}
exports.default = addExp;
