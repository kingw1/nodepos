const express = require("express");
const app = express();
const service = require("./Service");
const UserModel = require("../models/UserModel");

app.get("/user/list", service.isLogedIn, async (req, res) => {
  try {
    const results = await UserModel.findAll({
      order: [["id", "DESC"]],
    });
    res.send({ message: "success", results: results });
  } catch (error) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/user/create", service.isLogedIn, async (req, res) => {
  try {
    await UserModel.create(req.body);
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/user/edit", service.isLogedIn, async (req, res) => {
  try {
    await UserModel.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/user/delete/:id", service.isLogedIn, async (req, res) => {
  try {
    await UserModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
