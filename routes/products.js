const express = require("express");

const productRoutes = express.Router();
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

productRoutes.route("/products").get((req, res) => {
  // if index type is text;
  // productRoutes.route("/products/search/:name").get(function(req, res) {
  //     let db_connect = dbo.getDb("fast_burger");
  //     let searchQuery = { $text: { $search: req.params.name } };
  //     db_connect.collection("products_list").find(searchQuery, { score: { $meta: "textScore" } })
  //         .sort({ score: { $meta: "textScore" } })
  //         .toArray(function(err, result) {
  //             if (err) throw err;
  //             res.json(result);
  //         });
  // });
  const db_connect = dbo.getDb("fast_burger");

  const { searchTerm, sortOption, filterOption } = req.query;
  const query = {};

  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: "i" };
  }

  if (filterOption) {
    query.type = filterOption;
  }

  const sortQuery = {};
  if (sortOption) {
    if (sortOption === "name" || sortOption === "price") {
      sortQuery[sortOption] = 1;
    }
  }

  db_connect
    .collection("products_list")
    .find(query)
    .sort(sortQuery)
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

productRoutes.route("/modifications/:productType").get(async (req, res) => {
  const db_connect = dbo.getDb("fast_burger");
  const { productType } = req.params;

  try {
    const modifications = await db_connect
      .collection("modifications")
      .findOne();

    if (modifications && modifications[productType]) {
      res.json({ productType, modifications: modifications[productType] });
    } else {
      res.json({ productType, modifications: [] });
    }
  } catch (err) {
    console.error("Error fetching modifications:", err);
    res.status(500).send("Internal Server Error");
  }
});

productRoutes.route("/types").get(async (req, res) => {
  const db_connect = dbo.getDb("fast_burger");

  try {
    const modifications = await db_connect
      .collection("modifications")
      .findOne();

    if (modifications) {
      const types = Object.keys(modifications).filter((type) => type !== "_id");
      res.json({ types });
    } else {
      res.json({ types: [] });
    }
  } catch (err) {
    console.error("Error fetching modification types:", err);
    res.status(500).send("Internal Server Error");
  }
});

productRoutes.route("/products/:productId").put(async (req, res) => {
  const db_connect = dbo.getDb("fast_burger");
  const { productId } = req.params;
  const { name, price, type } = req.body;

  try {
    const result = await db_connect.collection("products_list").updateOne(
      { _id: ObjectId(productId) },
      {
        $set: {
          name,
          price,
          type,
        },
      },
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Product updated successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = productRoutes;
