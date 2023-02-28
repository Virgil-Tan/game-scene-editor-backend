const express = require("express");
const {verifyUser} = require("../../middlewares/verifyAuth");
const {handleImage} = require("../../middlewares/handleImage");
const {MaterialsController} = require("./materials.controller");

const router = express.Router();

router.post('', verifyUser, handleImage({'image': 'image'}), MaterialsController.uploadMaterial);

module.exports = router;
