const conn = require("../connect");
const { DataTypes } = require("sequelize");
const ProductModel = conn.define("product", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  barcode: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  cost: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.STRING,
  },
  detail: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
});

ProductModel.sync({ alter: true });

module.exports = ProductModel;
