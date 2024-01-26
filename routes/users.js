const express = require("express");

const userRoutes = express.Router();
const dbo = require("../db/conn");

userRoutes.route("/users/:email").get(async (req, res) => {
  const db_connect = dbo.getDb("fast_burger");
  const userEmail = req.params.email;

  try {
    const user = await db_connect
      .collection("users")
      .findOne({ email: userEmail });

    if (user) {
      const { _id, name, email, role, address, telephone } = user;
      res.json({
        _id,
        name,
        email,
        role,
        address,
        telephone,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
});

userRoutes.route("/login").post(async (req, res) => {
  const db_connect = dbo.getDb("fast_burger");
  const { email, hashedPassword } = req.body;

  try {
    const user = await db_connect.collection("users").findOne({ email });

    if (user && user.password === hashedPassword) {
      const { _id, name, email, role, address, telephone } = user;
      res.json({
        _id,
        name,
        email,
        role,
        address,
        telephone,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = userRoutes;
