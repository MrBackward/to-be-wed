const startsAt = new Date("2027-09-25T14:30:00+10:00");
const timeZone = "Australia/Sydney";

export const wedding = {
  couple: "Nat & Xander",
  monogram: "N&X",
  startsAt,
  date: new Intl.DateTimeFormat("en-AU", { timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(startsAt),
  time: new Intl.DateTimeFormat("en-AU", { timeZone, hour: "numeric", minute: "2-digit" }).format(startsAt),
  venue: "Venue TBC",
  address: "Address TBC",
  rsvpBy: "TBC",
};
