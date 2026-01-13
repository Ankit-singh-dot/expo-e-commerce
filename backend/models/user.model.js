import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  streetAddress: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  zipCode: {
    type: String,
    require: true,
  },
  PhoneNumber: {
    type: String,
    require: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
      unique: true,
      required: true,
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
