import fs from "fs"
import path from "path"
import date from "date"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expDb = require("./expDb.json")

export default function addExp(message, author) {
  // eslint-disable-next-line prefer-destructuring
  const id = author.id

  if (!expDb[id]) {
    expDb[id] = {
      exp: 0,
      totalexp: 0,
      level: 0,
      lastmessage: Date.now() - 60 * 1000,
    }
  }

  console.log(expDb[id].lastmessage)
  console.log(Date.now())

  if (Date.now() >= expDb[id].lastmessage + 60 * 1000) {
    const newExp = Math.floor(Math.random() * 11) + 15

    expDb[id].exp += newExp
    expDb[id].totalexp += newExp

    console.log("Exp granted!")

    expDb[id].lastmessage = Date.now()
  }

  // eslint-disable-next-line no-restricted-properties
  const nextLvlExp = 5 * Math.pow(expDb[id].level, 2) + 50 * expDb[id].level + 100

  if (expDb[id].exp >= nextLvlExp) {
    // eslint-disable-next-line operator-assignment
    expDb[id].exp = expDb[id].exp - nextLvlExp
    expDb[id].level += 1

    message.channel.send(
      `Congrats <@${id}> for reaching level **${expDb[id].level}**!`
    )

    return true
  }

  const data = JSON.stringify(expDb, null, 4)

  fs.writeFile(path.join(__dirname, "expDb.json"), data, (err) => {
    if (err) {
      console.log(err)
    }
    // Console.log("Data:")
    // Console.log(data)
  })

  // Fs.writeFileSync("expDb.json", data)
}
