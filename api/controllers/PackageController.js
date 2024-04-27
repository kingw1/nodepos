const express = require("express");
const app = express();
const PackageModel = require("../models/PackageModel");

app.get("/packages/list", async (req, res) => {
  try {
    const results = await PackageModel.findAll({
      order: ["price"],
    });
    res.send({ results: results });
  } catch (e) {
    res.statusCode(500).send({ message: e.message });
  }
});

module.exports = app;
