const {UsersModel} = require("./users.model");

class UsersService {
  constructor() {}

  async getUserProfile(userId) {
    return UsersModel.aggregate([
      {
        $match: {
          _id: userId
        }
      },
      {
        $lookup: {
          from: 'maps',
          localField: '_id',
          foreignField: 'author',
          as: 'maps'
        }
      },
      {
        $lookup: {
          from: 'maps',
          localField: '_id',
          foreignField: 'likesUsers',
          as: 'likedMaps'
        }
      },
      {
        $lookup: {
          from: 'maps',
          localField: '_id',
          foreignField: 'comments.author',
          as: 'commentedMaps'
        }
      }
    ])
  }

  async createUser(user) {
    return UsersModel.create(user);
  }

  async findUserByUsername(username) {
    return UsersModel.findOne({username});
  }

  async findUserByEmail(email) {
    return UsersModel.findOne({ email });
  }

  async updatePassword(user_id, newPasswordHash) {
    return UsersModel.findByIdAndUpdate(user_id, {passwordHash: newPasswordHash})
  }

  async updateUser(user_id, data) {
    return UsersModel.findByIdAndUpdate(user_id, data);
  }

  async resetPassword(email, newPasswordHash) {
    return UsersModel.findOneAndUpdate({
      email
    }, {
      $set: {
        passwordHash: newPasswordHash
      }
    })
  }

  async getAllUsers() {
    return UsersModel.find().lean();
  }
}

module.exports = {
  UsersService: new UsersService()
};
