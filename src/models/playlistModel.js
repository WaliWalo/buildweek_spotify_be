const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PlaylistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  songs: [{ songId: { type: Number } }],
});

// const PlaylistModel = mongoose.model("Song", PlaylistSchema);
module.exports = PlaylistSchema;
