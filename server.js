const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "routes.json";
let savedRoutes = [];

if (fs.existsSync(DATA_FILE)) {
  savedRoutes = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

app.get("/api/routes", (req, res) => {
  res.json(savedRoutes);
});

app.post("/api/routes", (req, res) => {
  const { start, stops } = req.body;
  if (!start || !Array.isArray(stops)) {
    return res.status(400).json({ error: "Invalid route data" });
  }
  savedRoutes.push({ start, stops });
  fs.writeFileSync(DATA_FILE, JSON.stringify(savedRoutes, null, 2));
  res.status(201).json({ message: "Route saved" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
