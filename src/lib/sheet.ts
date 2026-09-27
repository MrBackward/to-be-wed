import { auth, sheets, type sheets_v4 } from "@googleapis/sheets";
import { Resource } from "sst";

const COLUMNS = {
  name: "Guest",
  plusOneAllowed: "plus one allowed",
  partner: "Connected for single invite",
  token: "HASH STRING",
  accepted: "Invite Accepted",
  plusOne: "With +1",
  dietary: "Dietary Requirements",
  plusOneDietary: "+1 Dietary Requirements",
  song: "Song Requests",
  message: "Message to couple",
  response: "RSVP Response",
  ceremony: "Invited to ceremony",
} as const;

const OPTIONAL: Column[] = ["response", "ceremony"];

export type Column = keyof typeof COLUMNS;

export type Guest = {
  row: number;
  name: string;
  plusOneAllowed: boolean;
  partner: string;
  token: string;
  accepted: string;
  plusOne: string;
  dietary: string;
  plusOneDietary: string;
  song: string;
  message: string;
  response: string;
  ceremony: boolean;
};

export type Sheet = {
  title: string;
  columns: Record<Column, number>;
  guests: Guest[];
};

export type CellUpdate = { row: number; column: Column; value: string };

let client: sheets_v4.Sheets | undefined;
let tabTitle: string | undefined;

function api() {
  client ??= sheets({
    version: "v4",
    auth: new auth.JWT({
      email: Resource.GoogleClientEmail.value,
      key: Resource.GooglePrivateKey.value.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    }),
  });
  return client;
}

async function getTabTitle() {
  if (tabTitle) return tabTitle;
  if (process.env.SHEET_TAB) return (tabTitle = process.env.SHEET_TAB);
  const { data } = await api().spreadsheets.get({
    spreadsheetId: Resource.SheetId.value,
    fields: "sheets.properties.title",
  });
  const title = data.sheets?.[0]?.properties?.title;
  if (!title) throw new Error("Spreadsheet has no tabs");
  return (tabTitle = title);
}

function quoteTab(title: string) {
  return `'${title.replaceAll("'", "''")}'`;
}

function columnLetter(index: number) {
  let letter = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    letter = String.fromCharCode(65 + ((n - 1) % 26)) + letter;
  }
  return letter;
}

export async function loadSheet(): Promise<Sheet> {
  const title = await getTabTitle();
  const { data } = await api().spreadsheets.values.get({
    spreadsheetId: Resource.SheetId.value,
    range: quoteTab(title),
  });
  const [header = [], ...rows] = data.values ?? [];
  const headers = header.map((h) => String(h).trim().toLowerCase());

  const columns = Object.fromEntries(
    Object.entries(COLUMNS).map(([key, label]) => {
      const index = headers.indexOf(label.toLowerCase());
      if (index === -1 && !OPTIONAL.includes(key as Column)) throw new Error(`Sheet is missing the "${label}" column`);
      return [key, index];
    }),
  ) as Record<Column, number>;

  const guests = rows
    .map((cells, i) => {
      const cell = (column: Column) => String(cells[columns[column]] ?? "").trim();
      return {
        row: i + 2,
        name: cell("name"),
        plusOneAllowed: /^y(es)?$/i.test(cell("plusOneAllowed")),
        partner: cell("partner"),
        token: cell("token"),
        accepted: cell("accepted"),
        plusOne: cell("plusOne"),
        dietary: cell("dietary"),
        plusOneDietary: cell("plusOneDietary"),
        song: cell("song"),
        message: cell("message"),
        response: cell("response"),
        ceremony: /^y(es)?$/i.test(cell("ceremony")),
      };
    })
    .filter((guest) => guest.name);

  return { title, columns, guests };
}

export async function writeCells(sheet: Sheet, cells: CellUpdate[]) {
  const updates = cells.filter(({ column }) => sheet.columns[column] !== -1);
  const range = ({ row, column }: CellUpdate) => `${quoteTab(sheet.title)}!${columnLetter(sheet.columns[column])}${row}`;
  const filled = updates.filter(({ value }) => value !== "");
  const empty = updates.filter(({ value }) => value === "");

  await Promise.all([
    filled.length &&
      api().spreadsheets.values.batchUpdate({
        spreadsheetId: Resource.SheetId.value,
        requestBody: {
          valueInputOption: "RAW",
          data: filled.map((update) => ({ range: range(update), values: [[update.value]] })),
        },
      }),
    empty.length &&
      api().spreadsheets.values.batchClear({
        spreadsheetId: Resource.SheetId.value,
        requestBody: { ranges: empty.map(range) },
      }),
  ]);
}

export async function getInvitation(token: string) {
  const sheet = await loadSheet();
  const members = sheet.guests.filter((guest) => guest.token === token);
  if (members.length === 0) return null;
  return {
    sheet,
    members,
    responded: members.some((member) => member.accepted),
    ceremony: members.some((member) => member.ceremony),
  };
}

export type Invitation = NonNullable<Awaited<ReturnType<typeof getInvitation>>>;
