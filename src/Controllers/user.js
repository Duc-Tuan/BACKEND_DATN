const User = require("../Models/user");
const Product = require("../Models/Product");
const Carts = require("../Models/Cart");
const HistoryBuy = require("../Models/HistoryBuy");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Cloudinary = require("../utils/cloudnary");
const Pay = require("../Models/Pay");
const nodemailer = require("nodemailer");

const index = (req, res, next) => {
  User.find({})
    .then((users) => {
      return res.status(200).json({
        users,
      });
    })
    .catch((err) => next(err));
};

const getloginUser = (req, res, next) => {
  const { token } = req.body;
  const dataToken = jwt.verify(token, "Anhtuan2002.");
  if (dataToken === null) {
    return res.status(200).json({ data: [] });
  } else if (dataToken) {
    return res.status(200).json({ data: dataToken.user });
  } else {
    console.log("ERROR");
  }
};

const postLoginUser = (req, res, next) => {
  var { name, password } = req.body;
  User.findOne({ user_name: name, user_password: password })
    .then((user) => {
      const token = jwt.sign({ user }, "Anhtuan2002.");
      return res.status(200).json({ token });
    })
    .catch((err) => next(err));
};

const newUser = async (req, res, next) => {
  const newUser = await new User(req.body.data);
  const data = await User.find({ user_name: req.body.data.user_name });
  if (data.length === 0) {
    newUser
      .save()
      .then(async (data) => {
        const dataCarts = {
          cart_user: data._id,
        };
        const dataPay = {
          pay_user: data._id,
        };
        const dataHistory = {
          HistoryBuy_user: data._id,
        };
        const carts = await new Carts(dataCarts);
        const pay = await new Pay(dataPay);
        const historyBuy = await new HistoryBuy(dataHistory);
        historyBuy.save();
        carts.save();
        pay.save();
        return {
          data,
          carts,
          pay,
          historyBuy,
        };
      })
      .then(async (data) => {
        const dataUSer = await User.findById(data.data._id);
        dataUSer.user_cartsID.push(data.carts._id);
        dataUSer.user_payID.push(data.pay._id);
        dataUSer.user_historyID.push(data.historyBuy._id);
        dataUSer.save();
        return res.status(200).json({ suss: "Register sussecc!!!" });
      })
      .catch((err) => next(err));
  } else {
    return res.status(200).json({ error: "Account already exists!!!" });
  }
};

const getUserById = (req, res, next) => {
  const { userID } = req.params;

  User.findById(userID)
    .then((user) => {
      return res.status(201).json({ user });
    })
    .catch((err) => next(err));
};

// put: thay thế toàn bộ (all user)
const replaceUser = (req, res, next) => {
  const { userID } = req.params;

  const newUser = req.body;

  User.findByIdAndUpdate(userID, newUser)
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

// patch: cập nhật 1 hoặc nhiều (one user)
const updateUser = async (req, res, next) => {
  const { userID } = req.params;
  const dataUser = await User.findById(userID);
  if (dataUser.avatar !== null && req.file) {
    const directoryPath =
      path.dirname(path.dirname(__dirname)) + `\\${dataUser.avatarMulter}`;
    await Cloudinary.uploader.destroy(dataUser.Cloudinary_id);
    fs.unlinkSync(directoryPath);

    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "avatar",
    });
    req.body.avatar = result.secure_url;
    req.body.avatarMulter = req.file.path;
    req.body.Cloudinary_id = result.public_id;
  } else if (dataUser.avatar === null && req.file) {
    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "avatar",
    });
    req.body.avatar = result.secure_url;
    req.body.avatarMulter = req.file.path;
    req.body.Cloudinary_id = result.public_id;
  } else if (req.file === null) {
    req.body.avatar = dataUser.avatar;
    req.body = req.body;
  }
  const newUser = req.body;
  await User.findByIdAndUpdate(userID, newUser)
    .then(() => {
      return User.findById(userID);
    })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};

const deleteUser = (req, res, next) => {
  const { userID } = req.params;
  User.findByIdAndDelete(userID)
    .then(async (user) => {
      const directoryPath =
        path.dirname(path.dirname(__dirname)) + `\\${user.avatarMulter}`;
      try {
        await Cloudinary.uploader.destroy(user.Cloudinary_id);
        fs.unlinkSync(directoryPath);
        res.status(200).send({
          message: "File is deleted.",
        });
      } catch (err) {
        res.status(500).send({
          message: "Could not delete the file. " + err,
        });
      }
      return res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

const getUserProduct = async (req, res, next) => {
  const { userID } = req.params;
  User.findById(userID)
    .populate("user_cartsID")
    .then((data) => {
      var a = [];
      data.user_cartsID.map((cart) => {
        return (a = cart.cart_data);
      });
      return a;
    })
    .then((data) => {
      return res.status(200).json({ carst: [...data] });
    })
    .catch((err) => next(err));
};

const newUseProduct = async (req, res, next) => {
  const { userID } = req.params;

  // create a new deck
  const newProducts = new Product(req.body);

  // get user
  const user = await User.findById(userID);

  await newProducts.save();

  user.user_cartsID.push(newProducts._id);

  await user.save();

  res.status(200).json({ carts: newProducts });
};

const deleteCartItem = async (req, res, next) => {
  const { userID, productID } = req.params;
  User.findById(userID)
    .then(async (user) => {
      const data = await Carts.findOne({ cart_user: userID });
      const a = data.cart_data.filter(
        (item) => item._id.toString() !== productID
      );
      const newCart = {
        cart_data: a,
      };
      const carts = await Carts.findByIdAndUpdate(
        { _id: user.user_cartsID[0] },
        newCart
      );
      return carts;
    })
    .then(async (data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const postProductUser = async (req, res, next) => {
  const { userID, productID } = req.params;
  User.findById(userID)
    .then(async (data) => {
      const dataProduct = await Product.findById(productID);
      return {
        dataProduct,
      };
    })
    .then(async (data) => {
      const dataCarts = await Carts.findOne({ cart_user: userID });
      const datas = {
        _id: data.dataProduct._id,
        name: data.dataProduct.product_name,
        monney: data.dataProduct.product_monney,
        percent: data.dataProduct.product_percent,
        quantity: req.body.quantity ? req.body.quantity : 1,
        price: req.body.price
          ? req.body.price
          : data.dataProduct.product_monney,
        avatar: data.dataProduct.product_img,
      };
      dataCarts.cart_data.push(datas);
      dataCarts.save();
      return dataCarts;
    })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const getUserPay = (req, res, next) => {
  const { userID } = req.params;
  User.findById(userID)
    .populate("user_payID")
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};
const newUsePay = (req, res, next) => {
  const { userID } = req.params;
  User.findById(userID)
    .then(async (data) => {
      const newPay = req.body;
      const pays = await Pay.findByIdAndUpdate(
        { _id: data.user_payID },
        newPay
      );
      return pays;
    })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const resetPass = async (req, res, next) => {
  const { UserName, Email, code } = req.body.data;

  const dataUser = await User.findOne({ user_name: UserName });
  var data;
  if (dataUser !== null) {
    const isEmail = dataUser.user_email === Email;
    if (isEmail) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "phamductuan032k2@gmail.com", // generated ethereal user
          pass: "mvzceghxfrdicnqa", // generated ethereal password
        },
      });

      let detail = {
        from: "phamductuan032k2@gmail.com",
        to: `${dataUser.user_email}`,
        subject: "testing our nodemailer",
        html: `<a href='http://localhost:3000/resetPassword/${code}/${dataUser._id}'>here</a>`,
      };

      transporter.sendMail(detail, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("oke");
        }
      });
      data = 1;
    } else {
      data = -1;
    }
  } else {
    data = "Le nom du compte n'existe pas.";
  }
  return res.status(200).json({ data });
};

const getUserHistory = (req, res, next) => {
  const { userID } = req.params;
  User.findById(userID)
    .then((data) => {
      return HistoryBuy.findById(data.user_historyID);
    })
    .then((data) => {
      return res.status(200).json({ data: data.HistoryBuy_data });
    })
    .catch((err) => next(err));
};

const newUseHistory = (req, res, next) => {
  const { userID } = req.params;
  User.findById(userID)
    .then(async (data) => {
      const newHistory = req.body.data;
      const Historys = await HistoryBuy.findById(data.user_historyID);
      Historys.HistoryBuy_data.push(newHistory);
      Historys.save();
      return Historys;
    })
    .then((data) => {
      return res.status(200).json({ data, suss: "Order Successfully!!!" });
    })
    .catch((err) => next(err));
};

const getUserHistoryStatus = (req, res, next) => {
  const { userID, statusName } = req.params;
  User.findById(userID)
    .then(async (data) => {
      const dataHistory = await HistoryBuy.findById(data.user_historyID);
      const result = dataHistory.HistoryBuy_data.filter(
        (item) => item.status === statusName
      );
      return result;
    })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

module.exports = {
  index,
  getloginUser,
  postLoginUser,
  newUser,
  getUserById,
  replaceUser,
  updateUser,
  deleteCartItem,
  deleteUser,
  getUserProduct,
  newUseProduct,
  postProductUser,
  getUserPay,
  newUsePay,
  resetPass,
  getUserHistory,
  newUseHistory,
  getUserHistoryStatus,
};
