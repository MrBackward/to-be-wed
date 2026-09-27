import { firstNames, lowerFirst } from "@/lib/names";
import type { Guest } from "@/lib/sheet";

const isComing = (guest: Guest) => /^y/i.test(guest.accepted);

function thanksMessage(members: Guest[]) {
  const coming = members.filter(isComing);
  const missing = members.filter((member) => !isComing(member));
  if (missing.length === 0) return "We can't wait to celebrate with you.";
  if (coming.length === 0) return "We'll miss you, and we're grateful you let us know.";
  const names = (guests: Guest[]) => firstNames(guests.map((guest) => guest.name));
  return `We can't wait to celebrate with ${names(coming)}, and we'll miss you, ${names(missing)}.`;
}

export function Confirmation({ greeting, members }: { greeting: string; members: Guest[] }) {
  const { song, message } = members[0];

  return (
    <section className="mt-8 space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-maroon-deep">Thank you, {greeting}</h2>
        <p className="mt-2 text-ink/80">
          {thanksMessage(members)}
        </p>
      </div>

      <ul className="space-y-3 rounded-md bg-maroon-mist/60 p-4 text-left">
        {members.map((member) => (
          <li key={member.row} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-maroon-deep">{member.name}</p>
              <p className="text-sm text-ink/80">
                {member.response ? lowerFirst(member.response) : isComing(member) ? "Attending" : "Not attending"}
              </p>
              {member.plusOne && (
                <p className="mt-1 text-sm text-ink/80">
                  <span className="font-medium text-maroon-deep">+1:</span> {member.plusOne}
                </p>
              )}
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                isComing(member) ? "bg-maroon text-ivory" : "bg-ink/10 text-ink/70"
              }`}
            >
              {isComing(member) ? "Coming" : "Not coming"}
            </span>
          </li>
        ))}
      </ul>

      {(song || message) && (
        <dl className="space-y-3 text-left text-sm">
          {song && (
            <div>
              <dt className="font-medium text-maroon-deep">Song request</dt>
              <dd className="text-ink/80">{song}</dd>
            </div>
          )}
          {message && (
            <div>
              <dt className="font-medium text-maroon-deep">Your note</dt>
              <dd className="whitespace-pre-line text-ink/80">{message}</dd>
            </div>
          )}
        </dl>
      )}

      <p className="text-sm text-ink/60">Need to change something? Just get in touch with us.</p>
    </section>
  );
}
