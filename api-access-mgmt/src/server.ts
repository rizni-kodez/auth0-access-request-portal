import app from "./app";
import { env } from "./config/env";
import { checkDatabaseConnection, initializeDatabase } from "./database/pool";

async function bootstrap(): Promise<void> {
  await checkDatabaseConnection();
  await initializeDatabase();

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`api-access-mgmt listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", error);
  process.exit(1);
});
