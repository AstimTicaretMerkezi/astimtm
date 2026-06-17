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
