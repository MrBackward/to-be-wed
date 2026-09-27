import { z } from "zod";
import { acceptReplies, declineReplies, emojis } from "@/config/rsvp";

export const rsvpSchema = z.object({
  members: z.array(
    z
      .object({
        row: z.number().int().positive(),
        attending: z.enum(["", "yes", "no"]).refine((value) => value !== "", "Please let us know"),
        feeling: z.string().trim().max(40, "Keep it under 40 characters"),
        emoji: z.string().refine((value) => value === "" || emojis.includes(value)),
        reply: z.string(),
        dietary: z.string().trim().max(200),
        bringingPlusOne: z.boolean(),
        plusOneName: z.string().trim().max(100),
        plusOneDietary: z.string().trim().max(200),
      })
      .refine((member) => member.reply === "" || repliesFor(member.attending).includes(member.reply), {
        path: ["reply"],
      })
      .refine((member) => member.attending !== "yes" || !member.bringingPlusOne || member.plusOneName, {
        message: "Please tell us their name",
        path: ["plusOneName"],
      }),
  ),
  song: z.string().trim().max(200),
  message: z.string().trim().max(1000),
});

export type RsvpValues = z.input<typeof rsvpSchema>;

export function repliesFor(attending: string) {
  if (attending === "yes") return acceptReplies;
  if (attending === "no") return declineReplies;
  return [];
}

export function replyFor(attending: string, reply: string) {
  return reply || (attending === "yes" ? "accepts" : "declines");
}
