import express from "express";
import cors from "cors";
import helmet from "helmet";
import healthRouter from "./routes/health.routes";
import accessRequestRouter from "./routes/accessRequest.routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/access-requests", accessRequestRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
