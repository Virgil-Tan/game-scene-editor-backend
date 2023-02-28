const mongoose = require("mongoose");

const MapsSchema = new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  collaborators: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  width: Number,
  height: Number,
  mapImageSrc: String,
  published: {
    type: Boolean,
    default: false
  },
  publishTime: {
    type: Date
  },
  publishText: {
    type: String,
    default: ''
  },
  createdTime: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  layers: {
    type: Array,
    default: []
  },
  likesUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  comments: {
    type: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comment: String,
      createdTime: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  }
}, {
  timestamps: true
});

module.exports = {
  MapsModel: mongoose.model("Map", MapsSchema)
}
