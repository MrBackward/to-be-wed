const timeZone = "Australia/Sydney";
const at = (day: string, time: string) => new Date(`${day}T${time}:00+10:00`);

const ceremony = { start: at("2027-09-25", "11:00"), end: at("2027-09-25", "12:00") };
const reception = { start: at("2027-09-25", "14:30"), end: at("2027-09-26", "00:00") };

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-AU", { timeZone, hour: "numeric", minute: "2-digit" }).format(date);
}

export const wedding = {
  couple: "Nat & Xander",
  monogram: "N&X",
  ceremony,
  reception,
  date: new Intl.DateTimeFormat("en-AU", { timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(reception.start),
  venue: "Venue TBC",
  address: "Address TBC",
  rsvpBy: "TBC",
};
