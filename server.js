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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/advantage", {
  useMongoClient: true
})

app.get("/", function(req, res) {
  res.redirect("/scrape");
});

app.get("/scrape", function(req, res){
  axios.get("http://www.echojs.com/").then(function(response) {

      let $ = cheerio.load(response.data);

      $("article h2").each(function(i, element) {
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
    .then(function(dbArticle) {
      res.send("Scrape Complete");
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, () => console.log("Listening on port:", PORT) );
