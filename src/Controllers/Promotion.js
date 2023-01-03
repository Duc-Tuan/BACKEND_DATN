const Promotion = require("../Models/Promotion");
const Cloudinary = require("../utils/cloudnary");
const fs = require("fs");
const path = require("path");

const getAll = (req, res, next) => {
  Promotion.find()
    .then((data) => {
      return res.status(200).json({
        data,
      });
    })
    .catch((err) => next(err));
};

const postAll = async (req, res, next) => {
  const dataPromo = req.files;
  let PromoImage = {},
    imgMulter = {};
  for (var i = 0; i < dataPromo.length; i++) {
    const result = await Cloudinary.uploader.upload(dataPromo[i].path, {
      folder: "promotion",
    });
    PromoImage = {
      url: result.secure_url,
      Cloudinary_id: result.public_id,
    };
    imgMulter = dataPromo[i].path;
  }
  req.body.Promotion_image = PromoImage;
  req.body.Promotion_multer = imgMulter;

  const newPromotion = new Promotion(req.body);
  newPromotion
    .save()
    .then((data) => {
      return res.status(201).json({ data });
    })
    .catch((err) => next(err));
};

const getPromoID = (req, res, next) => {
  const { promotionID } = req.params;
  Promotion.findById(promotionID)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const postPromoID = async (req, res, next) => {
  const { promotionID } = req.params;

  const dataPromotion = req.files;
  try {
    const data = await Promotion.findById(promotionID);
    if (data && dataPromotion.length > 0) {
      await Cloudinary.uploader.destroy(data.Promotion_image.Cloudinary_id);
      const directoryPath =
        path.dirname(path.dirname(__dirname)) + `\\${data.Promotion_multer}`;
      fs.unlinkSync(directoryPath);

      let image = {},
        avtMulter = {};
      for (var i = 0; i < dataPromotion.length; i++) {
        const result = await Cloudinary.uploader.upload(dataPromotion[i].path, {
          folder: "promotion",
        });
        image = {
          url: result.secure_url,
          Cloudinary_id: result.public_id,
        };
        avtMulter = dataPromotion[i].path;
      }

      req.body.Promotion_image = image;
      req.body.Promotion_multer = avtMulter;
    }
  } catch (err) {
    console.log(err);
  }
  const promotions = await Promotion.findByIdAndUpdate(promotionID, req.body);
  promotions
    .save()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => console.log(err));
};

const deletePromoID = async (req,res,next) => {
  const { promotionID } = req.params;
  const dataPromotion = await Promotion.findById(promotionID);
  if (dataPromotion) {
    await Cloudinary.uploader.destroy(dataPromotion.Promotion_image.Cloudinary_id);
    const directoryPath =
      path.dirname(path.dirname(__dirname)) + `\\${dataPromotion.Promotion_multer}`;
    fs.unlinkSync(directoryPath);
  }
  Promotion.findByIdAndDelete(promotionID)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => console.log(err));
}

module.exports = {
  getAll,
  postAll,
  getPromoID,
  postPromoID,
  deletePromoID
};
