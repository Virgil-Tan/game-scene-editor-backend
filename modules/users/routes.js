const express = require("express");
const {UsersController} = require("./users.controller");
const {verifyUser} = require("../../middlewares/verifyAuth");
const {handleImage} = require("../../middlewares/handleImage");

const router = express.Router();

router.get('/all', verifyUser, UsersController.getAllUsers);
router.put('/profile', verifyUser, UsersController.updateData);
router.get('/profile', verifyUser, UsersController.getProfile);
router.post("/register", UsersController.signUp);
router.post('/login', UsersController.signIn);
router.put("/password", verifyUser, UsersController.updatePassword);
router.post('/reset-password', UsersController.resetPassword);
router.get('/check-reset-password-code/:code', UsersController.checkResetPasswordCode);
router.put('/reset-password', UsersController.updatePassword);

module.exports = router;
