import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.coerce.number().int().positive().default(4000),
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
	AUTH0_DOMAIN: z.string().min(1, "AUTH0_DOMAIN is required"),
	AUTH0_AUDIENCE: z.string().min(1, "AUTH0_AUDIENCE is required"),
	AUTH0_CLIENT_ID: z.string().optional(),
	AUTH0_CLIENT_SECRET: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	const message = parsedEnv.error.issues
		.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
		.join("; ");
	throw new Error(`Invalid environment variables: ${message}`);
}

export const env = parsedEnv.data;
