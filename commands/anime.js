module.exports = {
  name: "anime",
  description: "Search for an anime on MAL",
  args: true,
  usage: "<anime name>",
  execute(message, args) {
    const jikanjs = require("jikanjs");

    jikanjs
      .search("anime", args.join(" "), 1, { limit: 1 })
      .then(response => {
        console.log(response);
        const myProcessedData = response.results.map(function(result) {
          return {
            mal_id: result.mal_id,
            title: result.title,
            episodes: result.episodes,
            synopsis: result.synopsis,
            url: result.url
          };
        });
        message.channel.send("Title: " + myProcessedData[0].title);
        message.channel.send("Synopsis: " + myProcessedData[0].synopsis);
        message.channel.send("Link: " + myProcessedData[0].url);
      })
      .catch(err => {
        console.error(err);
        message.channel.send(
          "Sorry your request couldn't be executed \nPlease try later or contact vme"
        );
      });
  }
};
