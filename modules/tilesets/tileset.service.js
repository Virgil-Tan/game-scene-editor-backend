const {TilesSetModel} = require("./tileset.model");


class TileSetService {
  constructor() {}

  async getUserTiles(userId) {
    return TilesSetModel.find({
      author: userId
    })
  }

  async createTile(tile) {
    return TilesSetModel.create(tile);
  }

  async deleteTile(tileId) {
    return TilesSetModel.findByIdAndDelete(tileId);
  }

  async updateTile(tileId, tileData) {
    return TilesSetModel.findOneAndUpdate(tileId, tileData);
  }
}

module.exports = {
  TileSetService: new TileSetService()
}
