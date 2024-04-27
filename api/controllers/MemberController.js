const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const service = require("./Service");
const MemberModel = require("../models/MemberModel");
const PackageModel = require("../models/PackageModel");

require("dotenv").config();

app.post("/member/signin", async (req, res) => {
  try {
    const member = await MemberModel.findAll({
      where: {
        phone: req.body.phone,
        pass: req.body.pass,
      },
    });

    if (member.length > 0) {
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      res.send({ token: token, message: "success" });
    } else {
      res.status(401).send({ message: "No data found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/member/info", service.isLogedIn, async (req, res) => {
  try {
    MemberModel.belongsTo(PackageModel);

    const memberId = service.getMemberId(req);
    const member = await MemberModel.findByPk(memberId, {
      attributes: ["id", "name"],
      include: [
        {
          model: PackageModel,
          attributes: ["name"],
        },
      ],
    });

    res.send({ result: member, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/member/change-profile", service.isLogedIn, async (req, res, next) => {
  try {
    const memberId = service.getMemberId(req);
    const result = await MemberModel.update(req.body, {
      where: {
        id: memberId,
      },
    });
    res.send({ message: "success", result: result });
  } catch (error) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
