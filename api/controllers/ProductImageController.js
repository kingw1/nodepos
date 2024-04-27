const express = require("express");
const app = express();
const service = require("./Service");
const ProductImageModel = require("../models/ProductImageModel");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

app.use(fileUpload());

app.post("/productImage/upload", service.isLogedIn, async (req, res) => {
  try {
    const productImage = req.files.productImage;
    const imageName =
      "Product-" +
      req.body.productId +
      "-" +
      Date.now() +
      path.extname(productImage.name);
    const uploadPath = __dirname + "/../uploads/" + imageName;

    productImage.mv(uploadPath, async (err) => {
      if (err) {
        throw new Error(err);
      } else {
        await ProductImageModel.create({
          isMain: false,
          productId: req.body.productId,
          imageName: imageName,
        });

        res.send({ message: "success" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get(
  "/productImage/list/:productId",
  service.isLogedIn,
  async (req, res) => {
    try {
      const results = await ProductImageModel.findAll({
        where: {
          productId: req.params.productId,
        },
        order: [["id", "DESC"]],
      });

      res.send({ message: "success", results: results });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

app.delete("/productImage/delete/:id", service.isLogedIn, async (req, res) => {
  try {
    const productImage = await ProductImageModel.findByPk(req.params.id);
    const imageName = productImage.imageName;

    await ProductImageModel.destroy({
      where: {
        id: req.params.id,
      },
    });

    await fs.unlinkSync("uploads/" + imageName);

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get(
  "/productImage/choose-main-image/:id/:productId",
  service.isLogedIn,
  async (req, res) => {
    try {
      await ProductImageModel.update(
        { isMain: false },
        {
          where: {
            productId: req.params.productId,
          },
        }
      );

      await ProductImageModel.update(
        {
          isMain: true,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.send({ message: "success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

module.exports = app;
