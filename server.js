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
mongoose.connect("mongodb://localhost/advantage", {
  useMongoClient: true
});
mongoose.connection.on('open', () => console.log('🌎 Mongoose connected!') );

app.get("/", (req, res) => {
  res.redirect("/scrape");
});

app.get("/scrape", (req, res) => {

  axios.get("http://www.discovermeteor.com/blog/").then(function(response) {

      var $ = cheerio.load(response.data);

      $("article .summary").each(function(i,element) {
        var result = {};

        result.title = $(this)
          .children("h3")
          .children("a")
          .text();
          console.log("Results title:" + result.title);

        result.summary = $(this)
          .children(".summary-content")
          .text();
          console.log("Results Summary:" + result.summary);

        result.link = $(this)
          .children("h3")
          .children("a")
          .attr("href");
          console.log("Results link:" + result.link);

        db.Article
          .create(result)
      })
    })

    .then(function(dbArticle) {
      res.send("Scrape Complete");
    })

    .catch(function(err){
      res.json(err);
    });
});

app.get("/articles", (req, res) => {
  db.Article
    .find({})
    .then(function(dbArticle) {
      //res.json(dbArticle);
      res.render("index", {dbArticle: dbArticle});
    })
    .catch(err => res.json(err) );
});

app.listen(PORT, () => console.log("🌎 Live on http://localhost:", PORT) );
