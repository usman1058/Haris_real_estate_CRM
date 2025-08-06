export async function POST(req: Request) {
  const body = await req.json();
  console.log("🔔 Message to admin for approval:\n", body.message);

  // later: integrate with n8n webhook or WhatsApp API
  return Response.json({ status: 'ok' });
}
