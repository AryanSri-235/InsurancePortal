import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecret(): Uint8Array {
  const raw = process.env.USER_JWT_SECRET ?? process.env.JWT_SECRET;
  if (!raw) throw new Error("USER_JWT_SECRET is not set");
  return new TextEncoder().encode(raw);
}

const COOKIE_NAME = "user_token";
const EXPIRES_IN = 60 * 60 * 24 * 30; // 30 days

export interface UserPayload {
  id: number;
  phone: string;
  name: string;
  email?: string | null;
}

export async function signUserToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(getSecret());
}

export async function verifyUserToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function getUserSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export function userCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: EXPIRES_IN,
    path: "/",
  };
}
