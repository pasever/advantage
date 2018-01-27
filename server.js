const express = require("express"),
   bodyParser = require("body-parser"),
     mongoose = require("mongoose"),
      request = require("request"),
      cheerio = require("cheerio"),
       exphbs = require("express-handlebars"),
       logger = require("morgan"),
        axios = require("axios"),
         PORT = process.env.PORT || 8500,
          app = express(),
           db = require("./models");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  layoutsDir: app.get('views') + '/layouts',
  partialsDir: [app.get('views') + '/partials']
}));

app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/advantage");
mongoose.connection.on('open', () => console.log('🌎 Mongoose connected!') );

app.get("/", (req, res) => {
  res.redirect("/scrape");
});

app.get("/scrape", (req, res) => {
  axios.get("http://www.echojs.com/").then(response => {

      let $ = cheerio.load(response.data);

      $("article h2").each(element => {
        var result = {};

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        db.Article
          .create(result)
      })
    })
    .then(dbArticle => res.send("Scrape Complete") )
    .catch(err => res.json(err) );
});

app.get("/articles", (req, res) => {
  db.Article
    .find({})
    .then(dbArticle => {
      //res.json(dbArticle);
      res.render("index", dbArticle);
    })
    .catch(err => res.json(err) );
});

app.listen(PORT, () => console.log("🌎 live on http://localhost:", PORT) );
