import { NextRequest, NextResponse } from "next/server";
import { sendEmail, sendAppointmentConfirmation, sendAppointmentReminder } from "@/lib/email/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    switch (type) {
      case "appointment_confirmation":
        if (!data.to || !data.appointment) {
          return NextResponse.json(
            { error: "to and appointment are required" },
            { status: 400 }
          );
        }
        await sendAppointmentConfirmation(data.to, data.appointment);
        break;

      case "appointment_reminder":
        if (!data.to || !data.appointment) {
          return NextResponse.json(
            { error: "to and appointment are required" },
            { status: 400 }
          );
        }
        await sendAppointmentReminder(data.to, data.appointment);
        break;

      case "custom":
        if (!data.to || !data.subject) {
          return NextResponse.json(
            { error: "to and subject are required" },
            { status: 400 }
          );
        }
        await sendEmail({
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

















