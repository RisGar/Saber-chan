"use strict";
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const logger_1 = __importDefault(require("./logs/logger"));
const tts_1 = __importDefault(require("../tts"));
const renderSass_1 = __importDefault(require("./renderSass"));
class WebSocket {
    constructor(token, port, client) {
        this.token = token;
        this.port = port;
        this.client = client;
        this.app = express_1.default();
        const renderSassWS = new renderSass_1.default();
        this.app.engine("hbs", express_handlebars_1.default({
            extname: "hbs",
            defaultLayout: "layout",
            layoutsDir: path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), "src", "websocket", "layouts"),
        }));
        this.app.set("views", path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), "src", "websocket", "views"));
        this.app.set("view engine", "hbs");
        this.app.use(express_1.default.static(path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), "src", "websocket", "public")));
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(body_parser_1.default.json());
        this.registerRoots();
        this.server = this.app.listen(port, () => {
            const portLogger = new logger_1.default(1, `Port: ${this.server.address().port}`);
        });
    }
    checkToken(_token) {
        return _token === this.token;
    }
    registerRoots() {
        this.app.get("/", (req, res) => {
            const _token = req.query.token;
            if (!this.checkToken(_token)) {
                res.render("enter_token", {
                    title: "Saber-chan Webinterface: Enter Token",
                });
                return;
            }
            const chans = [];
            this.client.guilds.cache.forEach((c) => {
                chans.push({ id: "Server", name: `**${c.name}**` });
                c.channels.cache
                    .filter((c) => {
                    return c.type === "text";
                })
                    .forEach((c) => {
                    chans.push({ id: c.id, name: c.name });
                });
            });
            const vcchans = [];
            this.client.guilds.cache.forEach((c) => {
                vcchans.push({ id: "Server", name: `**${c.name}**` });
                c.channels.cache
                    .filter((c) => {
                    return c.type === "voice";
                })
                    .forEach((c) => {
                    vcchans.push({ id: c.id, name: c.name });
                });
            });
            res.render("index", {
                title: "Saber-chan Webinterface",
                token: _token,
                chans,
                vcchans,
            });
        });
        this.app.post("/sendMessage", (req, res) => {
            const _token = req.body.token;
            const { text } = req.body;
            const { channelid } = req.body;
            if (!_token || !channelid || !text) {
                const notThereWSLogger = new logger_1.default(3, "No token, channelid or text");
                return res.sendStatus(400);
            }
            if (channelid === "Server") {
                const cannotSendLogger = new logger_1.default(3, "Cannot send message to server");
                return res.sendStatus(400);
            }
            if (!this.checkToken(_token)) {
                res.render("error", {
                    title: "Saber-chan Webinterface ERROR",
                    errtype: "Invalid Token",
                });
                return;
            }
            const chanids = [];
            this.client.guilds.cache.forEach((c) => {
                c.channels.cache
                    .filter((c) => {
                    return c.type === "text";
                })
                    .forEach((c) => {
                    chanids.push(c);
                });
            });
            const chanArray = chanids.filter((o) => {
                return o.id === channelid;
            });
            const chan = chanArray[0];
            const sendingWSMsgLogger = new logger_1.default(1, `Sending message "${text}" to the channel "${chan.name}" (Websocket)`);
            if (chan) {
                chan.send(text);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(406);
            }
        });
        this.app.post("/vcMessage", (req, res) => {
            const _token = req.body.token;
            const text = req.body.vctext;
            const channelid = req.body.vcid;
            if (!_token || !channelid || !text) {
                const WSNoErrorLogger = new logger_1.default(3, "No token, channelid or text");
                return res.sendStatus(400);
            }
            if (channelid === "Server") {
                const cannotSendMsgLogger = new logger_1.default(3, "Cannot send message to server");
                return res.sendStatus(400);
            }
            if (!this.checkToken(_token)) {
                res.render("error", {
                    title: "Saber-chan Webinterface ERROR",
                    errtype: "Invalid Token",
                });
                return res.sendStatus(400);
            }
            const chanids = [];
            this.client.guilds.cache.forEach((c) => {
                c.channels.cache
                    .filter((c) => {
                    return c.type === "voice";
                })
                    .forEach((c) => {
                    chanids.push(c);
                });
            });
            const chanArray = chanids.filter((o) => {
                return o.id === channelid;
            });
            const chan = chanArray[0];
            if (chan) {
                const WSTtsRequest = new tts_1.default(text);
                const playFile = async () => {
                    const vc = await chan.join();
                    const dispatcher = vc.play("http://localhost:8081/");
                    dispatcher.on("finish", () => {
                        const sayingMsginVCWsLogger = new logger_1.default(1, `Saying "${text}" in channel "${chan.name}" (Websocket)`);
                        vc.disconnect();
                        const { fileServer } = WSTtsRequest;
                        http_1.default.get("http://localhost:8081/", () => {
                            fileServer.close();
                        });
                    });
                };
                playFile();
                res.sendStatus(200);
            }
            else {
                res.sendStatus(406);
            }
        });
    }
}
exports.default = WebSocket;
// Module.exports = WebSocket;
