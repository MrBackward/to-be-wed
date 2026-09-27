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
      <InviteHero greeting={greeting} />
      <div className="px-3 pt-2 sm:px-4">
        <Card>
          <WeddingDetails ceremonyGuest={invitation.ceremony} calendarToken={invitation.responded ? token : undefined} />
          {invitation.responded ? (
            <Confirmation greeting={greeting} members={invitation.members} />
          ) : (
            <RsvpForm token={token} members={members} />
          )}
        </Card>
      </div>
      <div className="pb-[env(safe-area-inset-bottom)]">
        <PhotoCredit />
      </div>
    </main>
  );
}
