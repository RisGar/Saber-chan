/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";
import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";
import http from "http";
import sass from "node-sass";
import fs from "fs";
import logger from "./logs/logger";
import tts from "../voice-rss-tts/index";
import { ttstoken } from "../config.json";

export default class WebSocket {
  token: string;

  port: number;

  client: any;

  app: any;

  server: any;

  constructor(token, port, client) {
    this.token = token;
    this.port = port;
    this.client = client;

    this.app = express();

    sass.render(
      {
        file: path.join(__dirname, "sass"),
        outFile: path.join(__dirname, "public/css"),
      },
      (error, result) => {
        if (!error) {
          const main = result;

          fs.writeFile(path.join(__dirname, "public/css"), main.css, (err) => {
            if (!err) {
              const cssWritten = new logger(1, "main.css has been written");
            }
          });
        }
      }
    );

    this.app.engine(
      "hbs",
      hbs({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: path.join(__dirname, "layouts"),
      })
    );
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "hbs");

    this.app.use(express.static(path.join(__dirname, "public")));

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    this.registerRoots();

    this.server = this.app.listen(port, () => {
      const portLogger = new logger(1, `Port: ${this.server.address().port}`);
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
        const notThereWSLogger = new logger(3, "No token, channelid or text");
        return res.sendStatus(400);
      }

      if (channelid === "Server") {
        const cannotSendLogger = new logger(3, "Cannot send message to server");
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

      const sendingWSMsgLogger = new logger(
        1,
        `Sending message "${text}" to the channel "${chan.name}" (Websocket)`
      );

      if (chan) {
        chan.send(text);
        res.sendStatus(200);
      } else {
        res.sendStatus(406);
      }
    });

    this.app.post("/vcMessage", (req, res) => {
      const _token = req.body.token;
      const text = req.body.vctext;
      const channelid = req.body.vcid;

      if (!_token || !channelid || !text) {
        const WSNoErrorLogger = new logger(3, "No token, channelid or text");
        return res.sendStatus(400);
      }

      if (channelid === "Server") {
        const cannotSendMsgLogger = new logger(
          3,
          "Cannot send message to server"
        );
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

      this.client.guilds.cache.forEach((c: any) => {
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
        const fileServer = http
          .createServer((response: any) => {
            tts.speech({
              key: ttstoken,
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

        const playFile = async () => {
          const vc = await chan.join();

          const dispatcher = vc.play("http://localhost:8081/");

          dispatcher.on("finish", () => {
            const sayingMsginVCWsLogger = new logger(1, `Saying "${text}" in channel "${chan.name}" (Websocket)`);
            vc.disconnect();

            http.get("http://localhost:8081/", () => {
              fileServer.close();
            });
          });
        };

        playFile();

        res.sendStatus(200);
      } else {
        res.sendStatus(406);
      }
    });
  }
}

// Module.exports = WebSocket;
