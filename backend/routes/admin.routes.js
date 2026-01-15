import { Router } from "express";
import {
  createProducts,
  getAllProducts,
  updateProducts,
} from "../controllers/admin.controllers.js";
import { adminOnly, protectedRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();
router.use(protectedRoute, adminOnly);
router.post("/products", upload.array("images", 3), createProducts);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProducts);

router.get("/order", getAllOrders);
// pending => shipped => delivered
router.patch("/order/:orderId", updateOrderStatus);
export default router;
