import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Trial from '@/models/Trial';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { logError, logInfo, withApiLogging } from '@/lib/logger';

// Mock Email Function (In a real app, use Resend or Nodemailer)
async function sendEmail({ to, subject, message }) {
  logInfo('trial.reply.email.mock_send', {
    to,
    subject,
    messageLength: message?.length,
  });
  // return await resend.emails.send({ ... });
  return { success: true };
}

async function handlePOST(req) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const body = await req.json();
    const { leadId, subject, message } = body;

    if (!leadId || !subject || !message) {
      return ApiResponse({ success: false, message: 'Missing required fields', status: 400 });
    }

    const lead = await Trial.findById(leadId);
    if (!lead) {
      return ApiResponse({ success: false, message: 'Lead not found', status: 404 });
    }

    // Trigger email transmission
    await sendEmail({
      to: lead.email,
      subject,
      message
    });

    // Atomically update the lead status to Replied and log admin ID
    lead.status = 'Replied';
    lead.repliedBy = user.id;
    lead.replySubject = subject;
    lead.replyMessage = message;
    lead.repliedAt = new Date();
    await lead.save();

    // TRIGGER NOTIFICATION: Athlete Journey
    // Find the user associated with this lead email if they exist
    const athleteUser = await User.findOne({ email: lead.email });
    if (athleteUser) {
      const coordStr = lead.coordinates ? `${lead.coordinates.lat}, ${lead.coordinates.lng}` : 'Finalizing Details';
      await Notification.create({
        recipientId: athleteUser._id,
        type: 'system',
        title: 'Trial Access Granted',
        message: `Your request has been approved! Protocol Location: ${coordStr}. Check your email for details.`,
        data: {
          leadId: lead._id,
          coordinates: lead.coordinates,
          subject,
          message
        }
      });
    }

    return ApiResponse({ success: true, message: 'Reply sent and status updated' });
  } catch (error) {
    logError('trial.reply.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const POST = withApiLogging(handlePOST, '/api/trial/reply');
