const path = require("path");
const { v4: uuid } = require("uuid");

function mvFile(file) {
  return new Promise((resolve, reject) => {
    let filename = uuid() + '.jpg';
    let mvPath = path.resolve(__dirname, `../public/images/${filename}`);
    file.mv(mvPath, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(`/images/${filename}`);
    })
  })
}

function handleImage(mapObj) {
  return async (req, res, next) => {
    for (let fileKey in mapObj) {
      if (fileKey.includes('*')) {
        let _fileKey = fileKey.slice(0, fileKey.length - 1);
        let files = [];
        let i = 0;
        while (req.files[_fileKey + i]) {
          files.push(req.files[_fileKey + i]);
          i ++;
        }
        req.body[mapObj[fileKey]] = await Promise.all(files.map(file => {
          return mvFile(file);
        }));
      } else {
        if (req.files) {
          let file = req.files[fileKey];
          if (file) {
            req.body[mapObj[fileKey]] = await mvFile(file);
          }
        }


      }
    }
    next();
  }
}

module.exports = {
  handleImage: handleImage
}