import "dotenv/config";

import express from "express";

import signalRoutes from "./routes/signal.routes";
import incidentRoutes from "./routes/incident.routes";

const app = express();

app.use(express.json());

app.use("/api/signals", signalRoutes);
app.use("/api/incidents", incidentRoutes);

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
