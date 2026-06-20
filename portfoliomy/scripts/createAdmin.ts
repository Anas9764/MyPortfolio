import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../src/lib/models/User";

dotenv.config({ path: ".env.local" });

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@anas.dev";
  const password = process.env.ADMIN_PASSWORD || "AdminPassword123";

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is required in .env.local");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.deleteMany({ email });
    await User.create({ email, password: hashedPassword });

    console.log("Admin User Created Successfully");
    console.log("Email:", email);
    console.log("Password:", password);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
