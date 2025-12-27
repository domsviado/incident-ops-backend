import "dotenv/config";

import express from "express";

import signalRoutes from "./routes/signals.routes";
import incidentRoutes from "./routes/incidents.rotues";

const app = express();

app.use(express.json());

app.use("/api/signals", signalRoutes);
app.use("/api/incidents", incidentRoutes);

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
