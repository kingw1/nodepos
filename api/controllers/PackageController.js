const express = require("express");
const app = express();
const PackageModel = require("../models/PackageModel");

app.get("/package/list", async (req, res) => {
  try {
    const result = await PackageModel.findAll();
    res.send({ result: result });
  } catch (e) {
    res.statusCode(500).send({ message: e.message });
  }
});

module.exports = app;
