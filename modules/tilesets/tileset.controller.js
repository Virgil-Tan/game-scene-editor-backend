const {mongo} = require("mongoose");
const {TileSetService} = require("./tileset.service");
const {MapsService} = require("../maps/maps.service");

class TilesetController {
  constructor() {}

  async getTilesetsOfMap(req, res) {
    try {

      const {map_id} = req.params;

      const map = await MapsService.getMapById(map_id);
      const author = map.author;
      const tiles = await TileSetService.getUserTiles(author._id.toString());
      res.status(200).json(tiles);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getTilesets(req, res) {
    try {
      const user = req.user;
      const tiles = await TileSetService.getUserTiles(mongo.ObjectId(user.id));
      res.status(200).json(tiles);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async updateTile(req, res) {
    try {
      const {tile_id} = req.params;
      const tile = req.body;
      await TileSetService.updateTile(tile_id, tile);
      res.status(200).send();
    }
     catch (err) {
      res.status(500).send(err.message);
    }
  }

  async deleteTile(req, res) {
    try {
      const {tile_id} = req.params;
      await TileSetService.deleteTile(tile_id);
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async createTile(req, res) {
    try {
      const {map_id} = req.params;
      const map = await MapsService.getMapById(map_id);
      const userId = map.author._id.toString();
      const tile = req.body;
      tile.author = mongo.ObjectId(userId);
      const newTile = await TileSetService.createTile(tile);
      res.status(201).json(newTile);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = {
  TilesetController: new TilesetController()
}
