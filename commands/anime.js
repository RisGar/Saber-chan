const Discord = require("discord.js");
const jikanjs = require("jikanjs");

module.exports = {
  name: "anime",
  description: "Search for an anime on MAL",
  args: true,
  usage: "<anime name>",
  execute(message, args) {
    jikanjs
      .search("anime", args.join(" "), 1, { limit: 1 })
      .then(response => {
        console.log(response);
        let myProcessedData = response.results.map(function(result) {
          return {
            mal_id: result.mal_id,
            title: result.title,
            episodes: result.episodes,
            synopsis: result.synopsis,
            url: result.url,
            image_url: result.image_url,
            type: result.type,
            score: result.score
          };
        });

        const animeEmbed = new Discord.MessageEmbed()
          //.setColor("#0099ff")
          .setTitle(myProcessedData[0].title)
          .setURL(myProcessedData[0].url)
          /*.setAuthor(
            "Some name",
            "https://i.imgur.com/wSTFkRM.png",
            "https://discord.js.org"
          )*/
          .setDescription(myProcessedData[0].synopsis)
          .setThumbnail(myProcessedData[0].image_url)
          .addFields(
            //{ name: "Regular field title", value: "Some value here" },
            //{ name: "\u200B", value: "\u200B" },
            {
              name: "Episodes",
              value: myProcessedData[0].episodes,
              inline: true
            },
            {
              name: "Type",
              value: myProcessedData[0].type,
              inline: true
            },
            {
              name: "Score",
              value: myProcessedData[0].score,
              inline: true
            }
          )
          /*.addField("Inline field title", "Some value here", true)
          .setImage(")*/
          .setTimestamp()
          .setFooter(
            "Saber-chan",
            "https://cdn.discordapp.com/avatars/629719032114970684/e619f816e4528964e907d369d28b63cc.jpg"
          );

        message.channel.send(animeEmbed);
      })
      .catch(err => {
        console.error(err);
        message.channel.send(
          "Sorry your request couldn't be executed \nPlease try later or contact vme"
        );
      });
  }
};
