import { notFound } from "next/navigation";
import { Confirmation } from "@/components/Confirmation";
import { Card, PhotoCredit } from "@/components/Frame";
import { RsvpForm, type Member } from "@/components/RsvpForm";
import { InviteHero, WeddingDetails } from "@/components/WeddingHeader";
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
      <div className="bg-[linear-gradient(to_bottom,var(--color-ivory)_4rem,var(--color-maroon-deep)_28rem)] px-3 pt-2 sm:px-4">
        <Card>
          <WeddingDetails
            ceremonyGuest={invitation.ceremony}
            responded={invitation.responded}
            calendarToken={invitation.members.some((member) => /^y/i.test(member.accepted)) ? token : undefined}
          />
          {invitation.responded ? (
            <Confirmation greeting={greeting} members={invitation.members} />
          ) : (
            <RsvpForm token={token} members={members} />
          )}
        </Card>
      </div>
      <div className="bg-maroon-deep pb-[env(safe-area-inset-bottom)]">
        <PhotoCredit onDark />
      </div>
    </main>
  );
}
