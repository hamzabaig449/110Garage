const mongoose = require("mongoose");

const rentModelSchema = new mongoose.Schema({
    imagePath: [{ type: String }],
    // originalImageName: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    dailyRent: { type: Number, required: true },
    weeklyRent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    priceStr: { type: String, required: true },
    // topspeed: { type: String, required: true },
    // time60: { type: String, required: true },
    // range: { type: String, required: true },
    // colour: { type: String, required: true },
    // interior: { type: String, required: true },
    // wheel: { type: String, required: true },
    description: { type: String, required: true },
    // safety: { type: String, required: true },
    // rangedesc: { type: String, required: true }
});

module.exports = mongoose.model("rentmodel", rentModelSchema, "rentmodel");
