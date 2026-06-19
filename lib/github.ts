const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

const BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

async function getFile(path: string) {
  const res = await fetch(`${BASE}/${path}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub GET failed: ${path}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: JSON.parse(content), sha: data.sha };
}

async function putFile(path: string, content: unknown, sha: string, message: string) {
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const res = await fetch(`${BASE}/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content: encoded, sha }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT failed: ${err}`);
  }
  return res.json();
}

export async function getUsers() {
  const { content, sha } = await getFile("data/users.json");
  return { users: content.users as User[], sha };
}

export async function saveUsers(users: User[], sha: string) {
  return putFile("data/users.json", { users }, sha, "chore: update users");
}

export type Subscriber = {
  id: string;
  name: string;
  email: string;
  subscribedAt: string;
};

export async function getSubscribers() {
  const { content, sha } = await getFile("data/subscribers.json");
  return { subscribers: content.subscribers as Subscriber[], sha };
}

export async function saveSubscribers(subscribers: Subscriber[], sha: string) {
  return putFile("data/subscribers.json", { subscribers }, sha, "chore: update subscribers");
}

export async function getAtolyeler() {
  const { content, sha } = await getFile("data/atolyeler.json");
  return { atolyeler: content, sha };
}

export async function saveAtolyeler(atolyeler: unknown, sha: string) {
  return putFile("data/atolyeler.json", atolyeler, sha, "chore: update atolyeler");
}

export type UserRole = "admin" | "kiracı" | "mülk-sahibi";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  atolyeId: string | null;
  createdAt: string;
};

export type Firm = {
  subId: number;
  businessName: string | null;
  ownerName: string | null;
  contactPerson: string | null;
  category: string | null;
  logo: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;
  description: string | null;
  taxNumber: string | null;
  address: string | null;
  workingHours: string | null;
  brands: string[];
  isActive: boolean;
};

export type Shop = {
  id: string;
  no: number;
  firms: Firm[];
};

/** Parse "B-04.1" → { blockKey:"B", shopId:"B-04", firmSubId:1 } */
export function parseFirmId(firmId: string): { blockKey: string; shopId: string; firmSubId: number } | null {
  const dotIdx = firmId.lastIndexOf(".");
  if (dotIdx === -1) return null;
  const shopId = firmId.slice(0, dotIdx);
  const firmSubId = parseInt(firmId.slice(dotIdx + 1), 10);
  if (isNaN(firmSubId)) return null;
  const blockKey = shopId.split("-")[0];
  return { blockKey, shopId, firmSubId };
}

/** Collect all firmIds across all shops, sorted */
export function allFirmIds(blocks: Record<string, { shops: Shop[] }>): string[] {
  const ids: string[] = [];
  for (const block of Object.values(blocks)) {
    for (const shop of block.shops) {
      for (const firm of (shop.firms ?? [])) {
        ids.push(`${shop.id}.${firm.subId}`);
      }
    }
  }
  return ids;
}

/** All assignable slot IDs.
 *  Single-tenant shops → bare shop ID (A-01).
 *  Multi-tenant shops  → dotted IDs (A-01.1, A-01.2). */
export function allSlotIds(blocks: Record<string, { shops: Shop[] }>): string[] {
  const ids: string[] = [];
  for (const block of Object.values(blocks)) {
    for (const shop of block.shops) {
      const firms = shop.firms ?? [];
      if (firms.length <= 1) {
        ids.push(shop.id);
      } else {
        for (const firm of firms) {
          ids.push(`${shop.id}.${firm.subId}`);
        }
      }
    }
  }
  return ids;
}
