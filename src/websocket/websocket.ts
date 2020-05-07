import * as path from "path";
import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";
import fs from "fs";
import http from "http";
import logger from "./logs/logger";
import tts from "../voice-rss-tts/index.js";
import { ttstoken } from "../config.json";

export * from "websocket";

class WebSocket {
  token: any;

  port: any;

  client: any;

  app: any;

  server: any;

  constructor(token, port, client) {
    this.token = token;
    this.port = port;
    this.client = client;

    this.app = express();

    this.app.engine(
      "hbs",
      hbs({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: __dirname + "/layouts",
      })
    );
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "hbs");

    this.app.use(express.static(path.join(__dirname, "public")));

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    this.registerRoots();

    this.server = this.app.listen(port, () => {
      new logger(1, `Port: ${this.server.address().port}`);
    });
  }

  checkToken(_token) {
    return _token == this.token;
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

      let chans = [];

      this.client.guilds.cache.forEach((c) => {
        chans.push({ id: "Server", name: `**${c.name}**` });
        c.channels.cache
          .filter((c) => c.type == "text")
          .forEach((c) => {
            chans.push({ id: c.id, name: c.name });
          });
      });

      // new logger(1, chans);

      let vcchans = [];

      this.client.guilds.cache.forEach((c) => {
        vcchans.push({ id: "Server", name: `**${c.name}**` });
        c.channels.cache
          .filter((c) => c.type == "voice")
          .forEach((c) => {
            vcchans.push({ id: c.id, name: c.name });
          });
      });

      // console.log(vcchans);

      res.render("index", {
        title: "Saber-chan Webinterface",
        token: _token,
        chans,
        vcchans,
      });
    });

    this.app.post("/sendMessage", (req, res) => {
      const _token = req.body.token;
      const text = req.body.text;
      const channelid = req.body.channelid;

      if (!_token || !channelid || !text) {
        new logger(3, "No token, channelid or text");
        return res.sendStatus(400);
      }

      if (channelid == "Server") {
        new logger(3, "Cannot send message to server");
        return res.sendStatus(400);
      }

      if (!this.checkToken(_token)) {
        res.render("error", {
          title: "Saber-chan Webinterface ERROR",
          errtype: "Invalid Token",
        });
        return;
      }

      // new logger(1, channelid);

      let chanids = [];

      this.client.guilds.cache.forEach((c) => {
        c.channels.cache
          .filter((c) => c.type == "text")
          .forEach((c) => {
            chanids.push(c);
          });
      });

      // new logger(1, chanids);

      let chanArray = chanids.filter((o) => {
        return o.id == channelid;
      });

      // new logger(1, chanArray);

      let chan = chanArray[0];

      // new logger(1, chan);

      logger(
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
        logger(3, "No token, channelid or text");
        return res.sendStatus(400);
      }

      if (channelid == "Server") {
        logger(3, "Cannot send message to server");
        return res.sendStatus(400);
      }

      if (!this.checkToken(_token)) {
        res.render("error", {
          title: "Saber-chan Webinterface ERROR",
          errtype: "Invalid Token",
        });
        return;
      }

      // new logger(1, channelid);

      let chanids = [];

      this.client.guilds.cache.forEach((c) => {
        c.channels.cache
          .filter((c) => c.type == "voice")
          .forEach((c) => {
            chanids.push(c);
          });
      });

      // new logger(1, chanids);

      let chanArray = chanids.filter((o) => {
        return o.id == channelid;
      });

      // console.log(chanArray);

      let chan = chanArray[0];

      // new logger(1, chan);

      /* new logger(
        1,
        `Saying "${text}" in channel "${chan.name}" (Websocket)`
      );*/

      if (chan) {
        const fileServer = http
          .createServer((response) => {
            tts.speech({
              key: ttstoken,
              hl: "en-us",
              src: text,
              r: 0,
              c: "mp3",
              f: "44khz_16bit_stereo",
              ssml: false,
              b64: false,
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
            new logger(
              1,
              `Saying "${text}" in channel "${chan.name}" (Command)`
            );
            vc.disconnect();

            http.get("http://localhost:8081/", function (response) {
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
