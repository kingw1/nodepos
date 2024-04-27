const express = require("express");
const app = express();
const service = require("./Service");
const ProductModel = require("../models/ProductModel");

app.post("/product/create", service.isLogedIn, async (req, res) => {
  try {
    const result = await ProductModel.create(req.body);

    res.send({ result: result, message: "success" });
  } catch (error) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/product/update", service.isLogedIn, async (req, res) => {
  try {
    const result = await ProductModel.update(req.body, {
      where: {
        id: req.body.id,
      },
    });

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/product/list", service.isLogedIn, async (req, res) => {
  try {
    const results = await ProductModel.findAll({
      order: [["id", "DESC"]],
    });

    res.send({ results: results, message: "success" });
  } catch (error) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/product/delete/:id", service.isLogedIn, async (req, res) => {
  try {
    const result = await ProductModel.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ result: result, message: "success" });
  } catch (error) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
