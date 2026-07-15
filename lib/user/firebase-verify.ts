import * as jose from "jose";

let publicKeys: Record<string, string> | null = null;
let expiresAt = 0;

async function getPublicKeys(): Promise<Record<string, string>> {
  if (publicKeys && Date.now() < expiresAt) return publicKeys;

  const res = await fetch(
    "https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com"
  );
  if (!res.ok) throw new Error("Failed to fetch Google public keys");
  
  publicKeys = await res.json();
  
  // Cache for the duration specified in Cache-Control header
  const cacheControl = res.headers.get("cache-control");
  const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
  expiresAt = Date.now() + (Number(maxAge) || 3600) * 1000;

  return publicKeys!;
}

export async function verifyFirebaseToken(token: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in environment");
  }

  const keys = await getPublicKeys();

  const verifiedToken = await jose.jwtVerify(
    token,
    async (header) => {
      const x509Cert = keys[header.kid as string];
      if (!x509Cert) {
        throw new Error("Invalid kid: public key not found");
      }
      return jose.importX509(x509Cert, "RS256");
    },
    {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
    }
  );

  return verifiedToken.payload;
}
