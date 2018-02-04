  const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    request = require("request"),
    cheerio = require("cheerio"),
    exphbs = require("express-handlebars"),
    logger = require("morgan"),
    axios = require("axios"),
    PORT = process.env.PORT || 9500,
    app = express(),
    db = require("./models");

  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(logger("dev"));

  app.engine("handlebars", exphbs({
    defaultLayout: "main",
    layoutsDir: app.get('views') + '/layouts',
    partialsDir: [app.get('views') + '/partials']
  }));

  app.set("view engine", "handlebars");

  mongoose.Promise = Promise;
  mongoose.connect("mongodb://localhost/advantage");
  mongoose.connection.on('open', () => console.log('🌎 Mongoose connected!'));

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/scrape", (req, res) => {

    axios.get("http://www.discovermeteor.com/blog/").then(function(response) {

        var $ = cheerio.load(response.data);

        $("article").each(function(i, element) {
          var result = {};

          result.title = $(this)
            .children(".summary")
            .children("h3")
            .children("a")
            .text();

          result.image = $(this)
            .children(".post-thumbnail")
            .children()
            .children()
            .attr("src");

          result.summary = $(this)
            .children(".summary")
            .children(".summary-content")
            .text();

          result.link = $(this)
            .children(".summary")
            .children("h3")
            .children("a")
            .attr("href");

          db.Article
            .create(result)
        })
      })

      .then(function(dbArticle) {
        res.redirect("/articles");
      })

      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/articles", async (req, res) => {
    try {
          const dblen = await db.Article.find({saved: true}).count();
      const dbArticle = await db.Article.find({});
      
      res.render('index', {
        dbArticle,
        dblen
      });
    } catch (err) {
      res.json(err);
    }
  });

  app.get("/saved", async (req, res) => {
  try {
    const dbArticle = await db.Article.find({ saved: true });

        res.render("saved", {
          dbArticle: dbArticle,
          dblen: dbArticle.length
        });
    } catch(err) {
      res.json(err);
    }
  });

  app.put("/save/:id", function(req, res) {

    const { id } = req.params;

    db.Article
      .updateOne({
      _id: id
    }, {
      saved: true
    })
    .then(function(dbArticle) {
        res.render("saved", {
        dbArticle: dbArticle
      });
    })
  });

  app.post("/articles/:id", function(req, res) {

    console.log(req.body);
    
    db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
app.get("/notes/", async function(req, res) {
  try {
    const dbNotes = await db.Note.find({});
    res.json(dbNotes);
  } catch(err) {
    res.json(err);
    }
});

  app.listen(PORT, () => console.log("🌎 Live on http://localhost:", PORT));
