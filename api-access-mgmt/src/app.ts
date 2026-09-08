import express from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import healthRouter from "./routes/health.routes";
import accessRequestRouter from "./routes/accessRequest.routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const logger = pino({
	level: env.NODE_ENV === "production" ? "info" : "debug"
});

app.use(helmet());
app.use(
	cors({
		origin: env.CORS_ORIGIN
	})
);
app.use(pinoHttp({ logger }));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/access-requests", accessRequestRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
