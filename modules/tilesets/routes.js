const express = require("express");
const {verifyUser} = require("../../middlewares/verifyAuth");
const {TilesetController} = require("./tileset.controller");

const router = express.Router();

router.get('', verifyUser, TilesetController.getTilesets);
router.post('/:map_id', verifyUser, TilesetController.createTile);
router.get('/map/:map_id', verifyUser, TilesetController.getTilesetsOfMap)
router.delete('/:tile_id', TilesetController.deleteTile);
router.put('/:tile_id', TilesetController.updateTile);

module.exports = router;
