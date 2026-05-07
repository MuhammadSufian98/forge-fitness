import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time'],
  },
  room: {
    type: String,
    required: [true, 'Please provide a room'],
  },
  coaches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  capacity: {
    type: Number,
    required: [true, 'Please provide capacity'],
  },
  isDaily: {
    type: Boolean,
    default: false,
  },
  editHistory: [{
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  hubMetrics: {
    attendanceRate: {
      type: Number,
      default: 0
    },
    peakOccupancy: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
