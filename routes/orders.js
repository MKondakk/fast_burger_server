const express = require("express");
const { validationResult, body } = require("express-validator");

const orderRoutes = express.Router();
const dbo = require("../db/conn");

orderRoutes
  .route("/orders/add")
  .post(
    [
      body("userInfo").notEmpty().withMessage("User info is required"),
      body("orderItems")
        .isArray({ min: 1 })
        .withMessage("Order items are required"),
      body("chosenPlace").notEmpty().withMessage("Chosen place is required"),
      body("totalPlace").notEmpty().withMessage("Total place is required"),
      body("dateTime").notEmpty().withMessage("Date and time are required"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const db_connect = dbo.getDb("fast_burger");
      const { userInfo, orderItems, chosenPlace, totalPlace, dateTime } =
        req.body;

      try {
        const result = await db_connect.collection("orders").insertOne({
          userInfo,
          orderItems,
          chosenPlace,
          totalPlace,
          dateTime,
        });
        res.status(201).json({
          success: true,
          message: "Order added successfully",
          id: result.insertedId,
        });
      } catch (err) {
        console.error("Error adding order:", err);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    },
  );

module.exports = orderRoutes;
