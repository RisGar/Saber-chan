"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "restart",
    description: "Restarting the bot",
    ownerOnly: true,
    args: false,
    execute(message) {
        message.channel.send("Restart initiated").then((msg) => {
            setTimeout(() => {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        msg.edit(`Restart in ${4 - i}`);
                    }, i * 1000);
                }
            }, 1000);
            setTimeout(() => {
                msg.edit(`Restarting`);
            }, 5000);
            setTimeout(() => {
                // TODO: Restarting the bot
            }, 6000);
        });
    },
};
