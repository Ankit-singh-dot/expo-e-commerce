import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  addAddresses,
  addToWishList,
  deleteAddresses,
  getAddresses,
  getWishList,
  removeFromWishList,
  updateAddresses,
} from "../controllers/user.controllers";
const router = Router();
router.use(protectedRoute);
router.post("/addresses", addAddresses);
router.get("/addresses", getAddresses);
router.put("addresses/:addressesId", updateAddresses);
router.delete("/addresses/:addressesId", deleteAddresses);

router.post("/wishlist", addToWishList);
router.delete("/wishlist/:productId", removeFromWishList);
router.get("/wishlist", getWishList);
export default router;
