import { AddToCalendar } from "@/components/AddToCalendar";
import { Monogram } from "@/components/Frame";
import { formatTime, wedding } from "@/config/wedding";

export function WeddingHeader({
  greeting,
  ceremonyGuest,
  calendarToken,
}: {
  greeting: string;
  ceremonyGuest: boolean;
  calendarToken?: string;
}) {
  const reception = `${formatTime(wedding.reception.start)} until late`;
  return (
    <header>
      <Monogram />
      <p className="font-serif text-2xl text-maroon italic">Dear {greeting},</p>
      <p className="mt-5 text-xs font-medium tracking-[0.2em] text-balance text-maroon/80 uppercase sm:tracking-[0.3em]">
        You&apos;re invited to the wedding of
      </p>
      <h1 className="mt-3 font-serif text-[clamp(2.25rem,11vw,3.75rem)] leading-tight whitespace-nowrap text-maroon-deep">
        {wedding.couple}
      </h1>
      <dl className="mx-auto mt-6 max-w-xs space-y-1 text-ink/80">
        <dt className="sr-only">When</dt>
        <dd className="font-medium text-ink">{wedding.date}</dd>
        {ceremonyGuest ? (
          <>
            <dd className="font-medium text-ink">Ceremony {formatTime(wedding.ceremony.start)}</dd>
            <dd className="font-medium text-ink">Reception {reception}</dd>
          </>
        ) : (
          <dd className="font-medium text-ink">{reception}</dd>
        )}
        <dt className="sr-only">Where</dt>
        <dd>{wedding.venue}</dd>
        <dd className="text-sm text-pretty">{wedding.address}</dd>
      </dl>
      {calendarToken ? (
        <AddToCalendar token={calendarToken} ceremonyGuest={ceremonyGuest} />
      ) : (
        <p className="mt-6 text-sm text-maroon italic">Kindly reply by {wedding.rsvpBy}</p>
      )}
      <div className="mx-auto mt-8 h-px w-24 bg-gold" />
    </header>
  );
}
