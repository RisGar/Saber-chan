class logger {
  constructor(level, message) {
    this.level = level;
    this.message = message;

    if (typeof level !== "number" || level > 3) {
      console.log("A wrong level has been given to the logger")
    }

    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    const levels = ["", "[INFO]: ", "[WARN]: ", "[ERROR]: "]

    const now = Date.now();
    const date_zenbu = new Date(now);
    const date = date_zenbu.getDate();
    const month = date_zenbu.getMonth() + 1;
    const year = date_zenbu.getFullYear();
    const hours = date_zenbu.getHours();
    const minutes = date_zenbu.getMinutes();
    const seconds = date_zenbu.getSeconds();

    const full_time = `${date}.${month}.${year} ${hours}:${minutes}:${seconds}`;

    console.log(`${full_time} ${levels[level]}${message}`);
  }
}

module.exports = logger;
