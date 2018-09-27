var mongoose = require("mongoose");

// reference to schema constructor
var Schema = mongoose.Schema;

// schema object
var ThreadSchema = new Schema({
  // author
  author: {
    type: String,
    required: true
  },
  // author profile link
  profile: {
    type: String,
    required: true
  },
  // title
  title: {
    type: String,
    required: true
  },
  // views
  views: {
    type: String,
    required: true
  },
  // replies
  replies: {
    type: String,
    required: true
  },
  // link
  link: {
    type: String,
    required: true
  },
  // notes array!
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

// create mongoose model
var Thread = mongoose.model("Thread", ThreadSchema);

// export model
module.exports = Thread;
