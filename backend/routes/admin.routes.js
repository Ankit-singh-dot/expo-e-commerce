import { Router } from "express";
import { createProducts } from "../controllers/admin.controllers.js";
const router = Router();
router.post("/products", protectedRoute, adminOnly, createProducts);
export default router;
