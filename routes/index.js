var express = require("express");
var router = express.Router();
const te = require("tradingeconomics");
require("dotenv").config();

router.get("/", function (req, res, next) {
  res.render("table");
});

router.get("/getCommodities", function (req, res, next) {
  te.login(process.env.API_KEY);
  te.getMarketSnap((marketsField = "commodities")).then(function (data) {
    res.send({
      data: data
    });
  });
});

module.exports = router;