const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "I am working on get request " }).status(200);
});

module.exports = router;
