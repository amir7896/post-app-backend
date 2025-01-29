const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  publicId: { type: String },
  secureUrl: { type: String },
  mediaType: { type: String, enum: ["image", "video"] },
});

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  media: { type: [mediaSchema], default: [] },
});

module.exports = mongoose.model("Post", postSchema);
