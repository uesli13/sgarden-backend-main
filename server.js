import "dotenv/config";

import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

import express from "express";
import morgan from "morgan";
import compression from "compression";
import favicon from "serve-favicon";
import cors from "cors";
import chalk from "chalk";
import Sentry from "@sentry/node";
import helmet from "helmet";

import routes from "./src/routes/index.js";
import { setServerTimeout } from "./src/middleware/index.js";
import { init } from "./src/utils/index.js";

const { NODE_ENV, PORT } = process.env;

Sentry.init({ enabled: NODE_ENV === "production" });

// Initialize mongoDB connection
init();

const app = express();
const server = http.Server(app);

app.use(Sentry.Handlers.requestHandler());

app.use(helmet({
	crossOriginResourcePolicy: false,
}));
app.use(setServerTimeout(2 * 60 * 1000));
if (NODE_ENV === "development") app.use(morgan("dev", { skip: (req) => req.method === "OPTIONS" }));
app.use(cors({ credentials: true, origin: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use((req, _, next) => { req.body ||= {}; next(); });
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(favicon(path.join(path.dirname(fileURLToPath(import.meta.url)), "src", "assets", "images", "favicon.ico")));

app.use("/api", routes);
app.all("/*", (_, res) => res.json({ body: "Render deployed!" }));

app.use(Sentry.Handlers.errorHandler());

const port = PORT || 4000;
server.listen(port, () => NODE_ENV !== "test" && console.log(chalk.bold.cyan(`>>> Live at http://localhost:${port}`)));

export default app;
