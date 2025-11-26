const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    age: { type: Number },
    breed: { type: String },
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    photoUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dog', DogSchema);

