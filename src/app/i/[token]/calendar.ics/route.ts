import { icsEvent, type CalendarEvent } from "@/lib/calendar";
import { getInvitation } from "@/lib/sheet";
import { verifyToken } from "@/lib/token";

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(request: Request, { params }: RouteContext<"/i/[token]/calendar.ics">) {
  const { token } = await params;
  if (!verifyToken(token)) return notFound();

  const invitation = await getInvitation(token);
  if (!invitation) return notFound();

  const event: CalendarEvent = new URL(request.url).searchParams.get("event") === "ceremony" ? "ceremony" : "reception";
  if (event === "ceremony" && !invitation.ceremony) return notFound();

  return new Response(icsEvent(event, invitation.ceremony, new URL(`/i/${token}`, request.url).toString()), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="nat-and-xander-${event}.ics"`,
      "Cache-Control": "private, no-store",
    },
  });
}
