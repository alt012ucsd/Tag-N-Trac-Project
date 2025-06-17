export async function GET() {
  return Response.json({
    location: "San Diego, CA",
    timestamp: "2025-06-17 14:42",
    rssi: -67,
    battery: 72,
    ai_summary:
      "Tracker has not moved in 6 hours. Signal strength dropping slightly.",
  });
}
