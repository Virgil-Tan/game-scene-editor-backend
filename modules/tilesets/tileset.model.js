const mongoose = require("mongoose");

const TileSchema = new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  sourcePath: String,
  createdTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  TilesSetModel: mongoose.model('TileSet', TileSchema)
}
