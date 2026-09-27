import { icsEvent } from "@/lib/calendar";
import { verifyToken } from "@/lib/token";

export async function GET(request: Request, { params }: RouteContext<"/i/[token]/calendar.ics">) {
  const { token } = await params;
  if (!verifyToken(token)) return new Response("Not found", { status: 404 });

  return new Response(icsEvent(new URL(`/i/${token}`, request.url).toString()), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="nat-and-xander-wedding.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
