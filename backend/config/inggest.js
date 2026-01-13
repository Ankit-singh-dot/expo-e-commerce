import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "ecommerce-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { connectDB } = await import("./db.js");
    const { User } = await import("../models/user.model.js");

    await connectDB();

    const { id, email_address, first_name, last_name, image_url } = event.data;

    await User.updateOne(
      { clerkId: id },
      {
        $setOnInsert: {
          clerkId: id,
          email: email_address?.[0]?.email_address,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          imageUrl: image_url,
          address: [],
          wishlist: [],
        },
      },
      { upsert: true }
    );
  }
);

const deleteUser = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { connectDB } = await import("./db.js");
    const { User } = await import("../models/user.model.js");

    await connectDB();

    await User.deleteOne({ clerkId: event.data.id });
  }
);

export const functions = [syncUser, deleteUser];
