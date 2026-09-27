import { formatTime, wedding } from "@/config/wedding";

export type CalendarEvent = "ceremony" | "reception";

const location = [wedding.venue, wedding.address].filter((part) => !part.includes("TBC")).join(", ");

function eventDetails(event: CalendarEvent, ceremonyGuest: boolean) {
  if (event === "ceremony") {
    return { ...wedding.ceremony, title: `${wedding.couple}'s wedding ceremony`, description: `Ceremony from ${formatTime(wedding.ceremony.start)}` };
  }
  return {
    ...wedding.reception,
    title: ceremonyGuest ? `${wedding.couple}'s wedding reception` : `${wedding.couple}'s wedding`,
    description: `From ${formatTime(wedding.reception.start)} until late`,
  };
}

function utcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function icsEvent(event: CalendarEvent, ceremonyGuest: boolean, url: string) {
  const { start, end, title, description } = eventDetails(event, ceremonyGuest);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//natandxander.wedding//RSVP//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event}@natandxander.wedding`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...(location ? [`LOCATION:${escapeText(location)}`] : []),
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function googleCalendarUrl(event: CalendarEvent, ceremonyGuest: boolean) {
  const { start, end, title, description } = eventDetails(event, ceremonyGuest);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    details: description,
  });
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params}`;
}
