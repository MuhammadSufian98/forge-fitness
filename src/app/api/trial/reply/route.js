import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Trial from '@/models/Trial';

// Mock Email Function (In a real app, use Resend or Nodemailer)
async function sendEmail({ to, subject, message }) {
  console.log(`Sending email to ${to}...`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  // return await resend.emails.send({ ... });
  return { success: true };
}

export async function POST(req) {
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

    return ApiResponse({ success: true, message: 'Reply sent and status updated' });
  } catch (error) {
    console.error('Trial Reply POST Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}
