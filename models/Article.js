const mongoose = require("mongoose"),
        Schema = mongoose.Schema;


const ArticleSchema = new Schema({
  title: {
        type: String,
    required: false
  },

  summary: {
        type: String,
    required: false
  },

  link: {
        type: String,
    required: false
  },

  note: {
    type: Schema.Types.ObjectId,
     ref: "Note"
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
