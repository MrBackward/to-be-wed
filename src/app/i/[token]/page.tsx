import { notFound } from "next/navigation";
import { Confirmation } from "@/components/Confirmation";
import { Card, PhotoCredit } from "@/components/Frame";
import { RsvpForm, type Member } from "@/components/RsvpForm";
import { InviteHero, WeddingDetails } from "@/components/WeddingHeader";
import { WeddingInfo } from "@/components/WeddingInfo";
import { randomEmotion } from "@/config/rsvp";
import { firstNames } from "@/lib/names";
import { getInvitation } from "@/lib/sheet";
import { verifyToken } from "@/lib/token";

export default async function InvitePage({ params }: PageProps<"/i/[token]">) {
  const { token } = await params;
  if (!verifyToken(token)) notFound();

  const invitation = await getInvitation(token);
  if (!invitation) notFound();

  const members: Member[] = invitation.members.map(({ row, name, plusOneAllowed }) => ({
    row,
    name,
    plusOneAllowed,
    feeling: randomEmotion(),
  }));
  const greeting = firstNames(invitation.members.map((member) => member.name));

  return (
    <main>
      <InviteHero greeting={greeting} responded={invitation.responded} />
      <div className="bg-[linear-gradient(to_bottom,var(--color-ivory)_4rem,var(--color-maroon-deep)_28rem)] space-y-6 px-3 pt-2 sm:px-4">
        <Card>
          <WeddingDetails
            ceremonyGuest={invitation.ceremony}
            responded={invitation.responded}
            calendarToken={invitation.members.some((member) => /^y/i.test(member.accepted)) ? token : undefined}
          />
          <WeddingInfo early={invitation.early} ceremony={invitation.ceremony} />
        </Card>
        <Card>
          {invitation.responded ? (
            <Confirmation greeting={greeting} members={invitation.members} />
          ) : (
            <section id="rsvp" aria-labelledby="rsvp-heading" className="scroll-mt-6">
              <h2
                id="rsvp-heading"
                className="text-xs font-medium tracking-[0.2em] text-maroon/80 uppercase sm:tracking-[0.3em]"
              >
                Your RSVP
              </h2>
              <RsvpForm token={token} members={members} />
            </section>
          )}
        </Card>
      </div>
      <div className="bg-maroon-deep pb-[env(safe-area-inset-bottom)]">
        <PhotoCredit onDark />
      </div>
    </main>
  );
}
