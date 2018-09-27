var mongoose = require("mongoose");

// reference to schema constructor
var Schema = mongoose.Schema;

// schema object
var NoteSchema = new Schema({
  // body
  body: String
});

// create mongoose model
var Note = mongoose.model("Note", NoteSchema);

// export model
module.exports = Note;
