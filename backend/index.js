import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
const app = express();
const _dirname = path.resolve();
const port = process.env.PORT;
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    message: "api is working",
    success: true,
  });
});

// development
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(_dirname, "../admin", "dist", "index.html"));
  });
}
app.listen(ENV.PORT, () => {
  console.log(`listening to the port ${port}`);
});
