import { mkdir, rm, writeFile } from "node:fs/promises";
import QRCode from "qrcode";
import { Resource } from "sst";
import { loadSheet, writeCells, type CellUpdate, type Guest } from "../src/lib/sheet";
import { createToken, verifyToken } from "../src/lib/token";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rotate = new Set(
  args.flatMap((arg, i) => (arg === "--rotate" && args[i + 1] ? [args[i + 1].toLowerCase()] : [])),
);

const key = (name: string) => name.trim().toLowerCase();
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

const sheet = await loadSheet();
const warnings: string[] = [];
const byName = new Map<string, Guest>();
for (const guest of sheet.guests) {
  if (byName.has(key(guest.name))) warnings.push(`"${guest.name}" appears more than once`);
  else byName.set(key(guest.name), guest);
}

const seen = new Set<number>();
const invitations: Guest[][] = [];
for (const guest of sheet.guests) {
  if (seen.has(guest.row)) continue;
  seen.add(guest.row);
  const members = [guest];
  if (guest.partner) {
    const partner = byName.get(key(guest.partner));
    if (!partner) {
      warnings.push(`${guest.name}: partner "${guest.partner}" isn't in the sheet`);
    } else if (key(partner.partner) !== key(guest.name)) {
      warnings.push(`${guest.name} lists ${partner.name}, but ${partner.name} doesn't list them back`);
    }
    if (partner && !seen.has(partner.row)) {
      seen.add(partner.row);
      members.push(partner);
    }
  }
  invitations.push(members);
}

for (const name of rotate) {
  if (!byName.has(name)) warnings.push(`--rotate "${name}" doesn't match any guest`);
}

const updates: CellUpdate[] = [];
const issued: { names: string; token: string }[] = [];
let created = 0;
let rotated = 0;

for (const members of invitations) {
  const names = members.map((member) => member.name).join(" & ");
  const existing = [...new Set(members.map((member) => member.token).filter(Boolean))];
  if (existing.length > 1) {
    warnings.push(`${names}: members have different tokens, left unchanged`);
    continue;
  }

  let [token] = existing;
  if (token && members.some((member) => rotate.has(key(member.name)))) {
    token = createToken();
    rotated++;
  } else if (!token) {
    token = createToken();
    created++;
  } else if (!verifyToken(token)) {
    warnings.push(`${names}: token isn't signed by this stage's LinkSecret, so the link won't work`);
  }

  for (const member of members) {
    if (member.token !== token) updates.push({ row: member.row, column: "token", value: token });
  }
  issued.push({ names, token });
}

console.log(`${invitations.length} invitations, ${created} new, ${rotated} rotated, ${updates.length} cells to write`);
for (const warning of warnings) console.warn(`warning: ${warning}`);

if (dryRun) {
  console.log("Dry run: nothing written.");
  process.exit(0);
}

await writeCells(sheet, updates);

const siteUrl = Resource.SiteUrl.value.replace(/\/+$/, "");
await rm("qr", { recursive: true, force: true });
await mkdir("qr");

const csv = [["Names", "URL", "File"].map(csvCell).join(",")];
const files = new Set<string>();
for (const { names, token } of issued) {
  const url = `${siteUrl}/i/${token}`;
  let file = slug(names) || "guest";
  for (let n = 2; files.has(file); n++) file = `${slug(names) || "guest"}-${n}`;
  files.add(file);
  const options = { errorCorrectionLevel: "M", margin: 2, color: { dark: "#4e0f18", light: "#ffffff" } } as const;
  await QRCode.toFile(`qr/${file}.svg`, url, { ...options, type: "svg" });
  await QRCode.toFile(`qr/${file}.png`, url, { ...options, type: "png", width: 1200 });
  csv.push([names, url, file].map(csvCell).join(","));
}
await writeFile("qr/invites.csv", csv.join("\n") + "\n");

console.log(`Wrote ${issued.length} QR codes and qr/invites.csv for ${siteUrl}`);
