import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
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
    
}
