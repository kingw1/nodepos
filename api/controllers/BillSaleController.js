const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Service = require("./Service");
const BillSaleModel = require("../models/BillSaleModel");
const BillSaleDetailModel = require("../models/BillSaleDetailModel");

require("dotenv").config();

app.get("/billSale/openBill", Service.isLogedIn, async (req, res) => {
  try {
    const payload = {
      userId: Service.getMemberId(req),
      status: "open",
    };
    let result = await BillSaleModel.findOne({
      where: payload,
    });
    if (result == null) {
      result = await BillSaleModel.create(payload);
    }
    res.send({ message: "success", result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/billSale/sale", Service.isLogedIn, async (req, res) => {
  try {
    const payload = {
      userId: Service.getMemberId(req),
      status: "open",
    };
    const currentBill = await BillSaleModel.findOne({
      where: payload,
    });
    const item = {
      price: req.body.price,
      productId: req.body.id,
      billSaleId: currentBill.id,
      userId: payload.userId,
    };

    const billSaleDetail = await BillSaleDetailModel.findOne({
      where: item,
    });

    if (billSaleDetail == null) {
      item.qty = 1;
      await BillSaleDetailModel.create(item);
    } else {
      item.qty = parseInt(billSaleDetail.qty) + 1;
      await BillSaleDetailModel.update(item, {
        where: {
          id: billSaleDetail.id,
        },
      });
    }

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/billSale/currentBillInfo", Service.isLogedIn, async (req, res) => {
  try {
    const BillSaleDetailModel = require("../models/BillSaleDetailModel");
    const ProductModel = require("../models/ProductModel");
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const results = await BillSaleModel.findOne({
      where: {
        userId: Service.getMemberId(req),
        status: "open",
      },
      include: {
        model: BillSaleDetailModel,
        order: [["id", "DESC"]],
        include: {
          model: ProductModel,
          attributes: ["name"],
        },
      },
    });

    res.send({ message: "success", results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/billSale/deleteItem/:id", Service.isLogedIn, async (req, res) => {
  try {
    await BillSaleDetailModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/billSale/updateQty/", Service.isLogedIn, async (req, res) => {
  try {
    await BillSaleDetailModel.update(
      {
        qty: req.body.qty,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
