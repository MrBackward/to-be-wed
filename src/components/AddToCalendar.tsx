"use client";

import { googleCalendarUrl } from "@/lib/calendar";

export function AddToCalendar({ token }: { token: string }) {
  return (
    <a
      href={`/i/${token}/calendar.ics`}
      onClick={(event) => {
        if (/android/i.test(navigator.userAgent)) {
          event.preventDefault();
          window.location.href = googleCalendarUrl();
        }
      }}
      className="mx-auto mt-6 flex min-h-12 w-full max-w-xs items-center justify-center gap-2 rounded-md border border-maroon bg-white px-6 py-3 text-base font-medium text-maroon-deep shadow-sm transition-colors hover:bg-maroon-mist focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]"
    >
      <span aria-hidden>📅</span> Add to calendar
    </a>
  );
}
