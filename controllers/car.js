const Car = require("../models/car");
const { STATUS_CODE, ERRORS, SUCCESS_MSG } = require("../constants");
const { cloudinary } = require("../cloudinary");

const getCars = async (req, res) => {
  try {
    const carsList = await Car.find({}).populate("userId", "userName -_id ");

    if (carsList.length > 0) {
      return res.status(STATUS_CODE.OK).json({ success: true, data: carsList });
    } else {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ success: true, data: null, message: ERRORS.CAR.NOT_FOUND });
    }
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      success: false,
      message: ERRORS.ERRORS.SERVER_ERROR,
      error: error.message,
    });
  }
};

const createCar = async (req, res) => {
  try {
    const { carModel, price, phoneNumber, city, maxPictures } = req.body;
    const userId = req.user.userId;

    // Uploading all images to cloudinary
    const uploadedPictures = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: process.env.CAR_IMAGE_FOLDER_NAME,
        });
        return {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      })
    );

    // Save car information with Cloudinary URLs
    const newCar = new Car({
      userId,
      carModel,
      price,
      phoneNumber,
      city,
      maxPictures,
      pictures: uploadedPictures,
    });

    const response = await newCar.save();
    if (response) {
      return res
        .status(STATUS_CODE.CREATED)
        .json({ success: true, message: SUCCESS_MSG.CAR.CREATED });
    } else {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ success: false, message: ERRORS.CAR.NOT_CREATED });
    }
  } catch (error) {
    console.log("Create car error ===>", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      success: false,
      message: ERRORS.ERRORS.SERVER_ERROR,
      error: error.message,
    });
  }
};

module.exports = {
  getCars,
  createCar,
};
