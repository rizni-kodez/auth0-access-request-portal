import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import { env } from "../config/env";

const pool = new Pool({
	connectionString: env.DATABASE_URL
});

pool.on("error", (error: Error) => {
	// Keep process alive but surface pooled client errors for observability.
	// eslint-disable-next-line no-console
	console.error("Unexpected PostgreSQL pool error:", error.message);
});

export async function checkDatabaseConnection(): Promise<void> {
	await pool.query("SELECT 1");
}

export async function initializeDatabase(): Promise<void> {
	const initSqlPath = path.join(process.cwd(), "src", "database", "init.sql");
	const sql = await readFile(initSqlPath, "utf8");
	await pool.query(sql);
}

export default pool;
