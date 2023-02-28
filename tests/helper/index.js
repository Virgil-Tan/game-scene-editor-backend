const mongoose = require("mongoose");

const MONGO_URI = `mongodb+srv://asdf:asdf@cluster0.kgnk5da.mongodb.net/game-editor?authSource=admin&replicaSet=atlas-srccxa-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;
//const MONGO_URI = `mongodb://localhost:27017/game-editor`;
const prepareTests = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URI, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    })
  })
}

const shutDownTests = () => {
  mongoose.connection.close();
}

module.exports = {
  prepareTests,
  shutDownTests
}
