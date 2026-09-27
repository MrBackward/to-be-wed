import { wedding } from "@/config/wedding";

const title = `${wedding.couple}'s wedding`;
const location = [wedding.venue, wedding.address].filter((part) => !part.includes("TBC")).join(", ");

function utcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function icsEvent(url: string) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//natandxander.wedding//RSVP//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:wedding@natandxander.wedding",
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(wedding.startsAt)}`,
    `SUMMARY:${escapeText(title)}`,
    ...(location ? [`LOCATION:${escapeText(location)}`] : []),
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function googleCalendarUrl() {
  const stamp = utcStamp(wedding.startsAt);
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${stamp}/${stamp}` });
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params}`;
}
