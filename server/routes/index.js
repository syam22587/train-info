const express = require("express");

const router = express.Router();
const cors = require("cors");
// import db from "../database";

router.get("/", (req, res) => {
  res.send({ message: "I am working on get request " }).status(200);
});

router.get("/getUserDetails", (req, res) => {
  res.send({ skv: "is testing " }).status(200);
});

module.exports = router;
