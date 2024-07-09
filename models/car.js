const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  carModel: { type: String, required: true, minlength: 3 },
  price: { type: Number, required: true },
  phoneNumber: { type: String, required: true, match: /^\d{11}$/ },
  city: { type: String, required: true },
  maxPictures: { type: Number, required: true, min: 1, max: 10 },
  pictures: [
    {
      public_id: { type: String },
      secure_url: { type: String },
    },
  ],
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
