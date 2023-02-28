const express = require("express");
const {verifyUser} = require("../../middlewares/verifyAuth");
const {handleImage} = require("../../middlewares/handleImage");
const {MapsController} = require("./maps.controller");

const router = express.Router();

router.get("", MapsController.getMaps);
router.put("/:map_id/work", verifyUser, MapsController.addWork);
router.get("/collaborate", verifyUser, MapsController.getCollaborateMaps);
router.get("/personal", verifyUser, MapsController.getMapsOfUser);
router.get("/public", MapsController.getPublicMaps);
router.get("/liked", verifyUser, MapsController.getLikedMaps);
router.get("/commented", verifyUser, MapsController.getCommentedMaps);
router.post("", verifyUser, MapsController.createMap);
router.get("/:map_id", MapsController.getMap);
router.get('/:map_id/comments', MapsController.getCommentsOfMap);
router.delete("/:map_id", verifyUser, MapsController.deleteMap);
router.put("/:map_id", verifyUser, MapsController.updateMap);
router.post('/:map_id/comment', verifyUser, MapsController.commentMap);
router.post("/:map_id/publish", verifyUser, MapsController.publishMap);
router.post('/:map_id/like', verifyUser, MapsController.likeMap);
router.delete('/:map_id/like', verifyUser, MapsController.cancelLikeMap);
router.post('/:map_id/collaborate', verifyUser, MapsController.addCollaborator);
router.delete('/:map_id/collaborate/:user_id', verifyUser, MapsController.removeCollaborator);
router.get(`/:map_id/collaborators`, verifyUser, MapsController.getCollaborators);


module.exports = router;
