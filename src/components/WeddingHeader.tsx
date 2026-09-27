import barn from "@/assets/venue-barn.jpg";
import { AddToCalendar } from "@/components/AddToCalendar";
import { Monogram } from "@/components/Frame";
import { Hero } from "@/components/Hero";
import { formatTime, wedding } from "@/config/wedding";

export function InviteHero({ greeting }: { greeting: string }) {
  return (
    <Hero
      image={barn}
      alt="The Bison Barn sign in front of the barn, with its timber sliding doors, festoon lights and native grasses"
      position="45% 42%"
    >
      <Monogram light />
      <p className="font-serif text-2xl text-ivory italic">Dear {greeting},</p>
      <p className="mt-4 text-xs font-medium tracking-[0.2em] text-balance text-gold uppercase sm:tracking-[0.3em]">
        You&apos;re invited to the wedding of
      </p>
      <h1 className="mt-2 font-serif text-[clamp(2.75rem,13vw,5rem)] leading-tight whitespace-nowrap">{wedding.couple}</h1>
      <p className="mt-2 text-sm text-ivory/90">
        {wedding.venue}
      </p>
      <a
        href="#details"
        className="mx-auto mt-6 mb-4 flex min-h-11 flex-col items-center justify-center px-4 text-xs font-medium tracking-[0.2em] text-ivory/85 uppercase"
      >
        RSVP below
        <svg aria-hidden viewBox="0 0 20 20" className="mt-1 size-5 animate-nudge fill-none stroke-current stroke-[1.8] motion-reduce:animate-none">
          <path d="M5.5 7.5 10 12l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </Hero>
  );
}

export function WeddingDetails({ ceremonyGuest, calendarToken }: { ceremonyGuest: boolean; calendarToken?: string }) {
  const reception = `${formatTime(wedding.reception.start)} until late`;
  return (
    <header id="details" className="scroll-mt-6">
      <p className="text-xs font-medium tracking-[0.2em] text-maroon/80 uppercase sm:tracking-[0.3em]">The details</p>
      <dl className="mx-auto mt-4 max-w-xs space-y-3 text-ink/80">
        <div>
          <dt className="sr-only">Date</dt>
          <dd className="font-serif text-2xl text-maroon-deep">{wedding.date}</dd>
        </div>
        {ceremonyGuest ? (
          <>
            <div>
              <dt className="text-sm text-ink/60">Ceremony</dt>
              <dd className="font-medium text-ink">
                {formatTime(wedding.ceremony.start)} at {wedding.ceremonySpot}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink/60">Reception</dt>
              <dd className="font-medium text-ink">
                {reception} in {wedding.receptionSpot.toLowerCase()}
              </dd>
            </div>
          </>
        ) : (
          <div>
            <dt className="sr-only">Time</dt>
            <dd className="font-medium text-ink">{reception}</dd>
          </div>
        )}
        <div>
          <dt className="sr-only">Venue</dt>
          <dd className="font-medium text-ink">{wedding.venue}</dd>
          <dd className="text-sm text-pretty">{wedding.address}</dd>
          <dd>
            <a
              href={wedding.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium text-maroon underline decoration-gold decoration-2 underline-offset-4"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-none stroke-current stroke-[1.8]">
                <path d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" strokeLinejoin="round" />
                <circle cx="10" cy="8" r="2.2" />
              </svg>
              Get directions
            </a>
          </dd>
        </div>
      </dl>
      {calendarToken ? (
        <AddToCalendar token={calendarToken} ceremonyGuest={ceremonyGuest} />
      ) : (
        <p className="mt-5 text-sm text-maroon italic">Kindly reply by {wedding.rsvpBy}</p>
      )}
      <div className="mx-auto mt-8 h-px w-24 bg-gold" />
    </header>
  );
}
