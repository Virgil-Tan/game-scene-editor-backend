const {MapsModel} = require("./maps.model");

class MapsService {
  constructor() {}

  async getCollaborateMaps(userId) {
    return MapsModel.find({
      collaborators: {
        $in: [userId]
      }
    }).populate("author");
  }

  async getCollaborators(map_id) {
    const map = await MapsModel.findById(map_id).populate('collaborators');
    return map.collaborators;
  }

  async addCollaborator(map_id, user_id) {
    return MapsModel.findByIdAndUpdate(map_id, {
      $push: {
        collaborators: user_id
      }
    })
  }

  async removeCollaborator(map_id, user_id) {
    return MapsModel.findByIdAndUpdate(map_id, {
      $pull: {
        collaborators: user_id
      }
    })
  }

  async createMap(map) {
    return MapsModel.create(map);
  }

  async deleteMap(map_id) {
    return MapsModel.findByIdAndDelete(map_id);
  }

  async updateMap(map_id, data) {
    return MapsModel.findByIdAndUpdate(map_id, data);
  }

  async getPersonalMaps(user) {
    return MapsModel.find({
      author: user
    }).populate("author")
  }

  async getPublicMaps() {
    return MapsModel.find({published: true}).populate("author").populate("comments.author");
  }

  async getMaps() {
    return MapsModel.find({}, {
      author: 1,
      _id: 1,
      name: 1,
      comments: 1,
      createdTime: 1
    }).populate("author").populate("comments.author");
  }

  async getMapById(map_id) {
    return MapsModel.findById(map_id).populate("author").populate("comments.author");
  }

  async getCommentsOfMap(map_id) {
    const map = await MapsModel.findById(map_id).populate("author").populate("comments.author").lean();
    return map.comments;
  }

  async commentMap(map_id, comment) {
    return MapsModel.findByIdAndUpdate(map_id, {
      $push: {
        comments: comment
      }
    })
  }

  async publishMap(map_id, publish_text) {
    return MapsModel.findByIdAndUpdate(map_id, {
      published: true,
      publishTime: new Date(),
      publishText: publish_text
    })
  }

  async likeMap(map_id, user) {
    return MapsModel.findByIdAndUpdate(map_id, {
      $push: {
        likesUsers: user
      }
    })
  }

  async cancelLikeMap(map_id, user) {
    return MapsModel.findByIdAndUpdate(map_id, {
      $pull: {
        likesUsers: user
      }
    })
  }

  async getLikedMaps(user) {
    return MapsModel.find({
      likesUsers: {
        $in: [user]
      }
    }).populate("author");
  }

  async getCommentedMaps(user) {
    return MapsModel.find({
      "comments.author": {
        $in: [user]
      }
    }).populate("author");
  }
}

module.exports = {
  MapsService: new MapsService()
}
