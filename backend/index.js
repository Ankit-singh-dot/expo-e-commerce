import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inggest.js";
import adminRoutes from "./routes/admin.routes.js"
const app = express();
app.use(express.json());
app.use(clerkMiddleware());
const _dirname = path.resolve();
const port = process.env.PORT;
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/admin",adminRoutes)
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    message: "api is working",
    success: true,
  });
});

// development
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(_dirname, "../admin/dist")));

//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.join(_dirname, "../admin", "dist", "index.html"));
//   });
// }
// app.listen(ENV.PORT, () => {

// });
// LOCAL DEVELOPMENT
if (ENV.NODE_ENV !== "production") {
  const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Local server running on port ${ENV.PORT}`);
    });
  };

  startServer();
}

// const startServer = async () => {
//   await connectDB();
//   app.listen(ENV.PORT, () => {
//     console.log(`listening to the port ${port}`);
//   });
// };
// startServer();
export default async (req, res) => {
  await connectDB();
  return app(req, res);
};
