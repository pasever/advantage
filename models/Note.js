const mongoose = require("mongoose"),
        Schema = mongoose.Schema;

const NoteSchema = new Schema({
     name: String,
     body: String
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
