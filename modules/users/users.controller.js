const {UsersService} = require("./users.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {mongo} = require("mongoose");
const {sendEmail} = require("../../helpers/sendEmail");
class UsersController {
  constructor() {}

  async getAllUsers(req, res) {
    try {
      const user = req.user;
      const users = await UsersService.getAllUsers();

      res.status(200).json(users.map(item => {
        item.own = item._id.toString() === user.id;
        return item;
      }));
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getProfile(req, res) {
    try {
      const user = req.user;
      const profile = await UsersService.getUserProfile(mongo.ObjectId(user.id));
      res.status(200).json(profile);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async signUp(req, res) {
    try {
      let newUser;
      const user = req.body;
      let oldUser = await UsersService.findUserByEmail(user.email);
      // check user if exist
      if (oldUser) {
        return res.status(409).send("User already exist. Please login.");
      }

      oldUser = await UsersService.findUserByUsername(user.username);
      if (oldUser) {
        return res.status(409).send("User already exist. Please login.");
      }

      // create new user
      user.passwordHash = await bcrypt.hash(user.password, 10);
      newUser = await UsersService.createUser(user);
      let token = jwt.sign({
        email: newUser.email,
        username: newUser.username,
        id: newUser._id
      }, process.env.JWT_SECRET)
      res.status(201).json({
        token
      });
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message);
    }
  }

  async signIn(req, res) {
    try {
      let oldUser,
        token;
      const {email, password} = req.body;
      // check user if exist
      oldUser = await UsersService.findUserByEmail(email);
      if (!oldUser) {
        return res.status(400).send("Invalid Credentials");
      }

      // check password if correct
      if (await bcrypt.compare(password, oldUser.passwordHash)) {
        token = jwt.sign({
          email: oldUser.email,
          username: oldUser.username,
          id: oldUser._id
        }, process.env.JWT_SECRET)
      } else {
        return res.status(400).send("Invalid Credentials");
      }
      res.status(200).json({token});
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async updatePassword(req, res) {
    const user = req.user;
    const {password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await UsersService.updatePassword(user.id, passwordHash);
    res.status(200).send();
  }

  async updateData(req, res) {
    try {
      const user = req.user;
      const data = req.body;
      if (data.password) {
        data.passwordHash = await bcrypt.hash(data.password, 10);
      }

      await UsersService.updateUser(user.id, data);
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async updatePassword(req, res) {
    try {
      const {email, password} = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      await UsersService.resetPassword(email, passwordHash);
      res.status(204).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async resetPassword(req, res) {
    try {
      const {email} = req.body;
      const user = await UsersService.findUserByEmail(email);
      if (!user) {
        return res.status(404).send("Not found.");
      }
      const resetCode = jwt.sign({
        email: email,
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      const resetUrl = process.env.CLIENT_URL + '/reset-password?code=' + resetCode;
      await sendEmail(email, resetUrl);
      res.status(204).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async checkResetPasswordCode(req, res) {
    try {
      const {code} = req.params;
      const data = jwt.verify(code, process.env.JWT_SECRET);
      if (data && data.email) {
        res.status(200).json(data);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }


}

module.exports = {
  UsersController: new UsersController()
};
