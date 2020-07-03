/* eslint-disable @typescript-eslint/class-name-casing */
import http from "http"
import speech from "./voice-rss-tts/index"
import { ttstoken } from "./config.json"

export default class tts {
  text: string

  server: http.Server

  fileServer: http.Server

  constructor(text: string) {
    this.text = text

    const fileServer = http
      .createServer((request, response) => {
        speech({
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
            response.end(error || content)
          },
        })
      })
      .listen(8081)

    this.fileServer = fileServer
  }
}
