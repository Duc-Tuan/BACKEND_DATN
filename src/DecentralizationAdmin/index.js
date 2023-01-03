const jwt = require("jsonwebtoken");
const UsersAdmin = require("../Models/Admin/Users");

const decentralization__Supreme = (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token;
    const result = jwt.verify(token, "Anhtuan2002.");
    if (result.user.length !== 0) {
      result.user.map((data) => {
        UsersAdmin.findById(data._id)
          .populate("role")
          .then((data) => {
            data.role.map((dataRole) => {
              if (dataRole.role_name === "Supreme") {
                req.id = data._id;
                return next();
              } else {
                return res.json({
                  data: null,
                  err: "Bạn không đủ quyền",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      });
    } else {
      return res.json({
        data: null,
        err: "Thông tin mật khẩu hoặc tài khoản không chính xác",
      });
    }
  } catch (err) {
    return res.json({ data: null, err: "Chưa login" });
  }
};

const decentralization__Users = (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token;
    const result = jwt.verify(token, "Anhtuan2002.");
    if (result.user.length !== 0) {
      result.user.map((data) => {
        UsersAdmin.findById(data._id)
          .populate("role")
          .then((data) => {
            data.role.map((dataRole) => {
              if (
                dataRole.role_name === "Supreme" ||
                dataRole.role_name === "Users"
              ) {
                req.id = data._id;
                return next();
              } else {
                return res.json({
                  err: "Bạn không đủ quyền",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      });
    } else {
      return res.json({
        err: "Thông tin mật khẩu hoặc tài khoản không chính xác",
      });
    }
  } catch (err) {
    return res.json({ err: "Chưa login" });
  }
};

const decentralization__Comments = (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token;
    const result = jwt.verify(token, "Anhtuan2002.");
    if (result.user.length !== 0) {
      result.user.map((data) => {
        UsersAdmin.findById(data._id)
          .populate("role")
          .then((data) => {
            data.role.map((dataRole) => {
              if (
                dataRole.role_name === "Supreme" ||
                dataRole.role_name === "Comments" ||
                dataRole.role_name === "Users"
              ) {
                req.id = data._id;
                return next();
              } else {
                return res.json({
                  err: "Bạn không đủ quyền",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      });
    } else {
      return res.json({
        err: "Thông tin mật khẩu hoặc tài khoản không chính xác",
      });
    }
  } catch (err) {
    return res.json({ err: "Chưa login" });
  }
};

const decentralization__Products = (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token;
    const result = jwt.verify(token, "Anhtuan2002.");
    if (result.user.length !== 0) {
      result.user.map((data) => {
        UsersAdmin.findById(data._id)
          .populate("role")
          .then((data) => {
            data.role.map((dataRole) => {
              if (
                dataRole.role_name === "Supreme" ||
                dataRole.role_name === "Products"
              ) {
                req.id = data._id;
                return next();
              } else {
                return res.json({
                  err: "Bạn không đủ quyền",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      });
    } else {
      return res.json({
        err: "Thông tin mật khẩu hoặc tài khoản không chính xác",
      });
    }
  } catch (err) {
    return res.json({ err: "Chưa login" });
  }
};

const decentralization__Orders = (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token;
    const result = jwt.verify(token, "Anhtuan2002.");
    if (result.user.length !== 0) {
      result.user.map((data) => {
        UsersAdmin.findById(data._id)
          .populate("role")
          .then((data) => {
            data.role.map((dataRole) => {
              if (
                dataRole.role_name === "Supreme" ||
                dataRole.role_name === "Orders"
              ) {
                req.id = data._id;
                return next();
              } else {
                return res.json({
                  err: "Bạn không đủ quyền",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      });
    } else {
      return res.json({
        err: "Thông tin mật khẩu hoặc tài khoản không chính xác",
      });
    }
  } catch (err) {
    return res.json({ err: "Chưa login" });
  }
};

const decentralization__Login = (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token;
    const result = jwt.verify(token, "Anhtuan2002.");
    if (result.user.length !== 0) {
      result.user.map((data) => {
        UsersAdmin.findById(data._id)
          .populate("role")
          .then((data) => {
            data.role.map((dataRole) => {
              if (
                dataRole.role_name === "Supreme" ||
                dataRole.role_name === "Users" ||
                dataRole.role_name === "Comments" ||
                dataRole.role_name === "Products" ||
                dataRole.role_name === "Orders"
              ) {
                req.id = data._id;
                return next();
              } else {
                return res.json({
                  err: "Bạn không đủ quyền",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      });
    } else {
      return res.json({
        err: "Thông tin mật khẩu hoặc tài khoản không chính xác",
      });
    }
  } catch (err) {
    return res.json({ err: "Chưa login" });
  }
};

module.exports = {
  decentralization__Supreme,
  decentralization__Users,
  decentralization__Comments,
  decentralization__Products,
  decentralization__Orders,
  decentralization__Login,
};
