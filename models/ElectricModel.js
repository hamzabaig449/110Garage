const mongoose = require("mongoose");

const electricModelSchema = new mongoose.Schema({
    imagePath: [{ type: String, required: false }],
    title: { type: String, required: false },
    t1: { type: String, required: false },
    t2: { type: String, required: false },
    year: { type: Number, required: false },
    price: { type: Number, required: false },
    priceStr: { type: String, required: false },
    topspeed: { type: String, required: false },
    time60: { type: String, required: false },
    range: { type: String, required: false },
    colour: { type: String, required: false },
    interior: { type: String, required: false },
    wheel: { type: String, required: false },
    description: { type: String, required: false },
    safety: { type: String, required: false },
    rangedesc: { type: String, required: false }
});

module.exports = mongoose.model("electricmodel", electricModelSchema, "electricmodel");
