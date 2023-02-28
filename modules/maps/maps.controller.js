const {MapsService} = require("./maps.service");
const {mongo} = require("mongoose");
const workingMap = {};
class MapsController {
  constructor() {}

  async addWork(req, res) {
    try {
      const {map_id} = req.params;
      const user = req.user;
      if (map_id && map_id !== 'undefined') {
        const working = workingMap[map_id];
        if (working && working.username !== user.username) {
          return res.status(410).send(`The ${working.username} is working!`);
        }
        if (working && working.username === user.username) {
          clearTimeout(workingMap[map_id].timer);
          workingMap[map_id].timer = setTimeout(() => {
            delete workingMap[map_id];
          }, 1000 * 60 * 5);
        } else {
          workingMap[map_id] = { username: user.username, timer: setTimeout(() => {
              delete workingMap[map_id];
            }, 1000 * 60 * 5) };
        }
      }

      res.status(204).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getCollaborateMaps(req, res) {
    try {
      const user = req.user;
      const maps = await MapsService.getCollaborateMaps(mongo.ObjectId(user.id));
      res.status(200).json(maps);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getCollaborators(req, res) {
    try {
      const {map_id} = req.params;
      const collaborators = await MapsService.getCollaborators(map_id);
      res.status(200).json(collaborators);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async addCollaborator(req, res) {
    try {
      const {map_id} = req.params;
      const {user} = req.body;
      const collaborators = await MapsService.getCollaborators(map_id);
      const has = collaborators.find(item => item._id.toString() === user.toString());
      if (has) {
        return res.status(409).send("Collaborator has exist!");
      }
      await MapsService.addCollaborator(map_id, mongo.ObjectId(user));
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async removeCollaborator(req, res) {
    try {
      const {map_id, user_id} = req.params;
      await MapsService.removeCollaborator(map_id, mongo.ObjectId(user_id));
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getMapsOfUser(req, res) {
    try {
      const user = req.user;
      const maps = await MapsService.getPersonalMaps(mongo.ObjectId(user.id));
      res.status(200).json(maps);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async createMap(req, res) {
    const user = req.user;
    const {name, width, height} = req.body;
    await MapsService.createMap({
      name: name,
      width,
      height,
      layers: [
        {
          name: 'default',
          tiles: []
        }
      ],
      author: mongo.ObjectId(user.id)
    });
    res.status(201).send();
  }

  async deleteMap(req, res) {
    const {map_id} = req.params;
    await MapsService.deleteMap(map_id);
    res.status(200).send();
  }

  async updateMap(req, res) {
    const {map_id} = req.params;
    const data = req.body;
    await MapsService.updateMap(map_id, data);
    res.status(200).send();
  }

  async getPublicMaps(req, res) {
    try {
      const maps = await MapsService.getPublicMaps();
      res.status(200).json(maps);
    } catch (err) {
      res.status(500).send(err.message);
    }

  }

  async getMaps(req, res) {
    const maps = await MapsService.getMaps();
    res.status(200).json(maps);
  }

  async getMap(req, res) {
    const {map_id} = req.params;
    const map = await MapsService.getMapById(map_id);
    res.status(200).json(map);
  }

  async getCommentsOfMap(req, res) {
    try {
      const {map_id} = req.params;
      const comments = await MapsService.getCommentsOfMap(map_id);
      comments.sort((prev, next) => {
        return new Date(next.createdTime).getTime() - new Date(prev.createdTime).getTime()
      })
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async commentMap(req, res) {
    const {map_id} = req.params;
    const user = req.user;
    const {comment} = req.body;
    await MapsService.commentMap(map_id, {
      comment,
      author: mongo.ObjectId(user.id)
    });
    res.status(201).send();
  }

  async publishMap(req, res) {
    const {map_id} = req.params;
    const {publish_text} = req.body;
    await MapsService.publishMap(map_id, publish_text);
    res.status(201).send();
  }

  async likeMap(req, res) {
    const {map_id} = req.params;
    const user = req.user;
    await MapsService.likeMap(map_id, mongo.ObjectId(user.id));
    res.status(201).send();
  }

  async cancelLikeMap(req, res) {
    const {map_id} = req.params;
    const user = req.user;
    await MapsService.cancelLikeMap(map_id, mongo.ObjectId(user.id));
    res.status(201).send();
  }

  async getLikedMaps(req, res) {
    try {
      const user = req.user;
      const maps = await MapsService.getLikedMaps(mongo.ObjectId(user.id));
      res.status(200).json(maps);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getCommentedMaps(req, res) {
    try {
      const user = req.user;
      const maps = await MapsService.getCommentedMaps(mongo.ObjectId(user.id));
      res.status(200).json(maps);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = {
  MapsController: new MapsController()
}
