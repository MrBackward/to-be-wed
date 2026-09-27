import { lowerFirst } from "@/lib/names";
import type { Guest } from "@/lib/sheet";

export function Confirmation({ greeting, members }: { greeting: string; members: Guest[] }) {
  const anyoneComing = members.some((member) => /^y/i.test(member.accepted));
  const { song, message } = members[0];

  return (
    <section className="mt-8 space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-maroon-deep">Thank you, {greeting}</h2>
        <p className="mt-2 text-ink/80">
          {anyoneComing ? "We can't wait to celebrate with you." : "We'll miss you, and we're grateful you let us know."}
        </p>
      </div>

      <ul className="space-y-2 rounded-md bg-maroon-mist/60 p-4 text-left">
        {members.map((member) => (
          <li key={member.row} className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="font-medium text-maroon-deep">{member.name}</span>
            <span className="text-sm text-ink/80">
              {member.response
                ? lowerFirst(member.response)
                : /^y/i.test(member.accepted)
                  ? "Attending"
                  : "Not attending"}
              {member.plusOne && ` with ${member.plusOne}`}
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
