import { notFound } from "next/navigation";
import { Confirmation } from "@/components/Confirmation";
import { Frame } from "@/components/Frame";
import { RsvpForm, type Member } from "@/components/RsvpForm";
import { WeddingHeader } from "@/components/WeddingHeader";
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
    <Frame>
      <WeddingHeader greeting={greeting} />
      {invitation.responded ? (
        <Confirmation greeting={greeting} members={invitation.members} />
      ) : (
        <RsvpForm token={token} members={members} />
      )}
    </Frame>
  );
}
