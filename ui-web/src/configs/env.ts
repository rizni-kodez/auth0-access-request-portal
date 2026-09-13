function getRequiredEnv(name: "VITE_AUTH0_DOMAIN" | "VITE_AUTH0_CLIENT_ID" | "VITE_AUTH0_AUDIENCE"): string {
  const value = (import.meta.env[name] as string | undefined)?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const appConfig = {
  apiBaseUrl:
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
    "http://localhost:4000",
  auth0Domain: getRequiredEnv("VITE_AUTH0_DOMAIN"),
  auth0ClientId: getRequiredEnv("VITE_AUTH0_CLIENT_ID"),
  auth0Audience: getRequiredEnv("VITE_AUTH0_AUDIENCE")
};
