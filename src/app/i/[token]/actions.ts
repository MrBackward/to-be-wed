"use server";

import { rsvpSchema, type RsvpValues } from "@/lib/schema";
import { getInvitation, writeCells, type CellUpdate } from "@/lib/sheet";
import { verifyToken } from "@/lib/token";

export type RsvpResult = { ok: true } | { ok: false; error: string };

export async function submitRsvp(token: string, values: RsvpValues): Promise<RsvpResult> {
  if (!verifyToken(token)) return { ok: false, error: "This invitation link isn't valid." };

  const parsed = rsvpSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check your answers and try again." };

  try {
    const invitation = await getInvitation(token);
    if (!invitation) return { ok: false, error: "We couldn't find your invitation." };
    if (invitation.responded) return { ok: false, error: "We've already received your RSVP." };

    const answers = new Map(parsed.data.members.map((answer) => [answer.row, answer]));
    const matches =
      answers.size === invitation.members.length &&
      invitation.members.every((member) => answers.has(member.row));
    if (!matches) return { ok: false, error: "Your invitation has changed. Please refresh and try again." };

    const { song, message } = parsed.data;
    const updates: CellUpdate[] = invitation.members.flatMap((member) => {
      const answer = answers.get(member.row)!;
      const attending = answer.attending === "yes";
      const plusOne = member.plusOneAllowed && attending && answer.bringingPlusOne ? answer.plusOneName : "";
      return [
        { row: member.row, column: "accepted", value: attending ? "Yes" : "No" },
        { row: member.row, column: "plusOne", value: plusOne },
        { row: member.row, column: "song", value: song },
        { row: member.row, column: "message", value: message },
      ];
    });

    await writeCells(invitation.sheet, updates);
    return { ok: true };
  } catch (error) {
    console.error("Failed to record RSVP", error);
    return { ok: false, error: "Something went wrong sending your RSVP. Please try again." };
  }
}
