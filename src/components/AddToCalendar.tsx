"use client";

import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

function CalendarButton({
  token,
  event,
  ceremonyGuest,
  label,
}: {
  token: string;
  event: CalendarEvent;
  ceremonyGuest: boolean;
  label: string;
}) {
  return (
    <a
      href={`/i/${token}/calendar.ics?event=${event}`}
      onClick={(clickEvent) => {
        if (/android/i.test(navigator.userAgent)) {
          clickEvent.preventDefault();
          window.location.href = googleCalendarUrl(event, ceremonyGuest);
        }
      }}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-maroon bg-white px-3 py-3 text-base font-medium text-maroon-deep shadow-sm transition-colors hover:bg-maroon-mist focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]"
    >
      <span aria-hidden>📅</span> {label}
    </a>
  );
}

export function AddToCalendar({ token, ceremonyGuest }: { token: string; ceremonyGuest: boolean }) {
  return (
    <div className="mx-auto mt-6 w-full max-w-xs">
      {ceremonyGuest ? (
        <>
          <p className="mb-2 text-sm font-medium text-ink/70">Add to your calendar</p>
          <div className="grid grid-cols-2 gap-2">
            <CalendarButton token={token} event="ceremony" ceremonyGuest label="Ceremony" />
            <CalendarButton token={token} event="reception" ceremonyGuest label="Reception" />
          </div>
        </>
      ) : (
        <CalendarButton token={token} event="reception" ceremonyGuest={false} label="Add to calendar" />
      )}
    </div>
  );
}
