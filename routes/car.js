const express = require("express");
const router = express.Router();
const carController = require("../controllers/car");
const { upload } = require("../cloudinary");
const isAuthenticate = require("../middlewares/authentication/auth");
const { validCar } = require("../middlewares/validations/carValidation");

router.get("/list", isAuthenticate, carController.getCars);
router.post(
  "/create",
  upload.array("pictures"),
  isAuthenticate,
  validCar,
  carController.createCar
);

module.exports = router;
