/* eslint-disable @typescript-eslint/class-name-casing */
import sass from "node-sass";
import path from "path";
import fs from "fs";
import logger from "./logs/logger";

export default class renderSass {
  render = () => {
    sass.render(
      {
        file: path.join(
          path.dirname(path.dirname(__dirname)),
          "src",
          "websocket",
          "sass",
          "main.scss"
        ),
        outFile: path.join(
          path.dirname(path.dirname(__dirname)),
          "src",
          "websocket",
          "public",
          "css",
          "main.css"
        ),
      },
      (error, result) => {
        if (!error) {
          const main = result;

          fs.writeFile(
            path.join(
              path.dirname(path.dirname(__dirname)),
              "src",
              "websocket",
              "public",
              "css",
              "main.css"
            ),
            main.css,
            (err) => {
              if (!err) {
                const cssWritten = new logger(1, "main.css has been written");
              } else {
                const cssNotWritten = new logger(
                  3,
                  "main.css has not been written!"
                );
              }
            }
          );
        } else {
          const cssNotWritten = new logger(3, "main.scss has not been read!");
        }
      }
    );
  };
}
