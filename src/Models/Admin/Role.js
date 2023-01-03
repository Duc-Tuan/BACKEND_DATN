const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const RoleAdminSchema = new Schema(
  {
    role_name: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const roleAdmin = mongodb.model("roleAdmin", RoleAdminSchema);
module.exports = roleAdmin;
