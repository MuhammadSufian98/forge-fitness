import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  date: {
    type: String, // Store as YYYY-MM-DD for easy comparison and uniqueness
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Unique index to prevent double booking the same session on the same day
BookingSchema.index({ userId: 1, scheduleId: 1, date: 1 }, { unique: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
