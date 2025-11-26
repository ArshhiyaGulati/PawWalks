const mongoose = require('mongoose');

const LocationUpdateSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WalkSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    walkerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true }],
    timeSlot: { type: String, required: true },
    duration: { type: Number, enum: [15, 30, 60], default: 30 },
    address: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'requested',
    },
    locationUpdates: [LocationUpdateSchema],
    summary: { type: String },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Walk', WalkSchema);

