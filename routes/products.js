const express = require("express");
const productRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

productRoutes.route("/products").get(function(req, res) {
    let db_connect = dbo.getDb("fast_burger"); 
    db_connect.collection("products_list").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


module.exports = productRoutes;
