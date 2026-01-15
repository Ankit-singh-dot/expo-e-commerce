import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
export async function createProducts(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        message: "All field are required",
      });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "at-least one image is required ",
      });
    }
    if (req.files.length > 3) {
      return res.status(400).json({
        message: "Maximum 3 images are allowed",
      });
    }
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseFloat(stock),
      category,
      images: imageUrls,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("error creating products", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function getAllProducts(req, res) {
  try {
    const product = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function updateProducts(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "product not found ",
      });
    }
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    // for cloudinary images upload

    if (req.files & (req.files.length > 0)) {
      if (req.files.length > 3) {
        return res.status(400).json({
          message: "maximum 3 images are allowed",
        });
      }

      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader(file.path, {
          folder: "products",
        });
      });
      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }
    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    const order = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.products")
      .sort({ createdAt: -1 });
    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({
        error: "Order not found",
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({
        error: "Order not found ",
      });
    }
    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
    await order.save();
    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus controllers:", error);
    return res.status(500).json({
      error: "Interval server error ",
    });
  }
}

export async function getAllCustomers(req, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({
      customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({
      error: "Interval server error ",
    });
  }
}

export async function getDashboardStats() {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const totalCostumer = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    res.status(200).json({
      totalRevenue,
      totalCostumer,
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard Status", error);
    return res.status(500).json({
      error: "Interval server error ",
    });
  }
}
