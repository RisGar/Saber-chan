class renderSass {
    function(){
    sass.render(
      {
        file: path.join(__dirname, "sass"),
        outFile: path.join(__dirname, "public/css"),
      },
      (error, result) => {
        if (!error) {
          main = result;

          fs.writeFile(path.join(__dirname, "public/css"), main.css, (err) => {
            if (!err) {
              new logger(1, "main.css has been written");
            }
          });
        }
      }
    );
  }
};

module.exports = renderSass;
