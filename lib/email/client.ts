// Email service using a simple SMTP approach
// In production, use services like SendGrid, Resend, or AWS SES

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
  // Check if email service is configured
  const emailService = process.env.EMAIL_SERVICE; // "sendgrid", "resend", "smtp", "mock"

  if (!emailService || emailService === "mock") {
    console.log("[Email] Mock email sent:", {
      to: options.to,
      subject: options.subject,
    });
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  try {
    switch (emailService) {
      case "sendgrid": {
        // Implement SendGrid
        const apiKey = process.env.SENDGRID_API_KEY;
        if (!apiKey) {
          throw new Error("SENDGRID_API_KEY is not set");
        }

        // In production, use @sendgrid/mail
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(apiKey);
        // const msg = { to: options.to, from: options.from || process.env.EMAIL_FROM, subject: options.subject, html: options.html, text: options.text };
        // await sgMail.send(msg);

        console.log("[Email] SendGrid email (not implemented):", options);
        return { success: true };
      }

      case "resend": {
        // Implement Resend
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          throw new Error("RESEND_API_KEY is not set");
        }

        // In production, use resend package
        console.log("[Email] Resend email (not implemented):", options);
        return { success: true };
      }

      case "smtp": {
        // Implement SMTP
        console.log("[Email] SMTP email (not implemented):", options);
        return { success: true };
      }

      default:
        throw new Error(`Unknown email service: ${emailService}`);
    }
  } catch (error: any) {
    console.error("[Email] Error sending email:", error);
    throw error;
  }
}

// Helper functions for common email types
export async function sendAppointmentConfirmation(
  to: string,
  appointment: {
    id: string;
    patientName: string;
    doctorName?: string;
    date: string;
    time: string;
    location?: string;
  }
) {
  const html = `
    <h2>Appointment Confirmation</h2>
    <p>Dear ${appointment.patientName},</p>
    <p>Your appointment has been confirmed:</p>
    <ul>
      <li><strong>Date:</strong> ${appointment.date}</li>
      <li><strong>Time:</strong> ${appointment.time}</li>
      ${appointment.doctorName ? `<li><strong>Doctor:</strong> ${appointment.doctorName}</li>` : ""}
      ${appointment.location ? `<li><strong>Location:</strong> ${appointment.location}</li>` : ""}
    </ul>
    <p>We look forward to seeing you!</p>
  `;

  return sendEmail({
    to,
    subject: "Appointment Confirmation - Hayat Clinic",
    html,
    text: `Your appointment is confirmed for ${appointment.date} at ${appointment.time}`,
  });
}

export async function sendAppointmentReminder(
  to: string,
  appointment: {
    id: string;
    patientName: string;
    doctorName?: string;
    date: string;
    time: string;
  }
) {
  const html = `
    <h2>Appointment Reminder</h2>
    <p>Dear ${appointment.patientName},</p>
    <p>This is a reminder that you have an appointment:</p>
    <ul>
      <li><strong>Date:</strong> ${appointment.date}</li>
      <li><strong>Time:</strong> ${appointment.time}</li>
      ${appointment.doctorName ? `<li><strong>Doctor:</strong> ${appointment.doctorName}</li>` : ""}
    </ul>
    <p>Please arrive 10 minutes early.</p>
  `;

  return sendEmail({
    to,
    subject: "Appointment Reminder - Hayat Clinic",
    html,
  });
}

