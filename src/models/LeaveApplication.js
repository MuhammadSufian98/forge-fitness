import mongoose from 'mongoose';

const LeaveApplicationSchema = new mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  endDate: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.LeaveApplication || mongoose.model('LeaveApplication', LeaveApplicationSchema);
