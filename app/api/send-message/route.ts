// app/api/send-matches/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { demandId, properties, message } = body;

    // TODO: Integrate WhatsApp/Twilio/email send here
    console.log(`Sending matches for demand ${demandId}:`, message);

    return NextResponse.json({ message: "Matches sent" });
  } catch (error) {
    console.error("SEND Matches Error:", error);
    return NextResponse.json({ error: "Failed to send matches" }, { status: 500 });
  }
}
