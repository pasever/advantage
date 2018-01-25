const express = require("express"),
   bodyParser = require("body-parser"),
     mongoose = require("mongoose"),
      request = require("request"),
      cheerio = require("cheerio"),
       exphbs = require("express-handlebars"),
         PORT = process.env.PORT || 8500,
          app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
  res.render("index");
});


app.listen(PORT, () => console.log("Listening on port:", PORT) );
