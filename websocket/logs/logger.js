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

    console.log(`${levels[level]}${message}`);
  }
}

module.exports = logger;
