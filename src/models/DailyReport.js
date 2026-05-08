import mongoose from 'mongoose';

const DailyReportSchema = new mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  time: {
    type: String, // HH:mm
    required: true,
  },
  sessionHighlights: {
    type: String,
    required: true,
  },
  issuesEncountered: {
    type: String,
    required: true,
  },
  agendaForNextSession: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// One report per coach per day
DailyReportSchema.index({ coachId: 1, date: 1 }, { unique: true });

export default mongoose.models.DailyReport || mongoose.model('DailyReport', DailyReportSchema);
