const express = require("express");
const app = express();
const Service = require("./Service");
const ProductModel = require("../models/ProductModel");

app.post("/product/create", Service.isLogedIn, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = Service.getMemberId(req);

    const result = await ProductModel.create(payload);

    res.send({ result: result, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/product/update", Service.isLogedIn, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = Service.getMemberId(req);

    const result = await ProductModel.update(payload, {
      where: {
        id: req.body.id,
      },
    });

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/product/list", Service.isLogedIn, async (req, res) => {
  try {
    const results = await ProductModel.findAll({
      where: {
        userId: Service.getMemberId(req),
      },
      order: [["id", "DESC"]],
    });

    res.send({ results: results, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/product/delete/:id", Service.isLogedIn, async (req, res) => {
  try {
    const result = await ProductModel.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ result: result, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/product/listForSale", Service.isLogedIn, async (req, res) => {
  const ProductImageModel = require("../models/ProductImageModel");
  ProductModel.hasMany(ProductImageModel);

  try {
    const results = await ProductModel.findAll({
      where: {
        userId: Service.getMemberId(req),
      },
      order: [["id", "DESC"]],
      include: {
        model: ProductImageModel,
        where: {
          isMain: true,
        },
      },
    });

    res.send({ message: "success", results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
