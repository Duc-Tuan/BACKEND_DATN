const path = require("path");
const multer = require("multer");

var storate = multer.diskStorage({
  destination: function (req, res, cd) {
    cd(null, "src/Images/avatarUsers");
  },
  filename: function (req, file, cd) {
    let ext = path.extname(file.originalname);
    cd(null, Math.ceil(Math.random() * 10000) + "_" + Date.now() + ext);
  },
});

var upload = multer({
  storage: storate,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      console.log("only jpg & png file supported!");
      callback(null, false);
    }
  },
});

module.exports = upload;
