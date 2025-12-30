import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    message: "api is working",
    success: true,
  });
});
app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});
