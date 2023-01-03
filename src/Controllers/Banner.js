const Banner = require("../Models/Banner");
const Cloudinary = require("../utils/cloudnary");
const fs = require("fs");
const path = require("path");

const getAll = (req, res, next) => {
  Banner.find()
    .then((Banner) => {
      return res.status(200).json({
        Banner,
      });
    })
    .catch((err) => next(err));
};

const postAll = async (req, res, next) => {
  const dataBanner = req.file;
  if (dataBanner) {
    const result = await Cloudinary.uploader.upload(dataBanner.path, {
      folder: "banner",
    });
    req.body.Banner_image = {
      url: result.secure_url,
      Cloudinary_id: result.public_id,
    };
    req.body.avatarMulter = dataBanner.path;
  }
  const newBanner = new Banner(req.body);
  newBanner
    .save()
    .then((data) => {
      return res.status(201).json({ data });
    })
    .catch((err) => next(err));
};

const getBannerID = (req, res, next) => {
  const { bannerID } = req.params;
  Banner.findById(bannerID)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};
const patchBannerID = async (req, res, next) => {
  const { bannerID } = req.params;
  const dataBanner = req.files;
  try {
    const dataBannerId = await Banner.findById(bannerID);
    if (dataBannerId && dataBanner.length > 0) {
      await Cloudinary.uploader.destroy(
        dataBannerId.Banner_image.Cloudinary_id
      );
      const directoryPath =
        path.dirname(path.dirname(__dirname)) +
        `\\${dataBannerId.avatarMulter}`;
      fs.unlinkSync(directoryPath);

      let image = {},
        avtMulter = {};
      for (var i = 0; i < dataBanner.length; i++) {
        const result = await Cloudinary.uploader.upload(dataBanner[i].path, {
          folder: "banner",
        });
        image = {
          url: result.secure_url,
          Cloudinary_id: result.public_id,
        };
        avtMulter = dataBanner[i].path;
      }

      req.body.Banner_image = image;
      req.body.avatarMulter = avtMulter;
      console.log(image, avtMulter);
    }
  } catch (err) {
    console.log(err);
  }
  const data = await Banner.findByIdAndUpdate(bannerID, req.body);
  data
    .save()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => console.log(err));
};

const deleteBannerID = async (req, res, next) => {
  const { bannerID } = req.params;
  const dataBannerId = await Banner.findById(bannerID);
  if (dataBannerId) {
    await Cloudinary.uploader.destroy(dataBannerId.Banner_image.Cloudinary_id);
    const directoryPath =
      path.dirname(path.dirname(__dirname)) + `\\${dataBannerId.avatarMulter}`;
    fs.unlinkSync(directoryPath);
  }
  Banner.findByIdAndDelete(bannerID)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getAll,
  postAll,
  getBannerID,
  patchBannerID,
  deleteBannerID,
};
