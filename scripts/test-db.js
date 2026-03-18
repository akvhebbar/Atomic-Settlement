import mongoose from "mongoose";

async function testMongoDB() {
  try {
    const mongoUrl =
      process.env.MONGODB_URL || "mongodb://localhost:27017/atomic-settlement";
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB successfully");

    // Test basic operations
    const db = mongoose.connection.db;
    const collections = await db.collections();
    console.log(`📊 Database has ${collections.length} collections`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("\n💡 Make sure MongoDB is running:");
    console.log("   Local: mongod");
    console.log("   Or check your MONGODB_URL in .env");
    process.exit(1);
  }
}

testMongoDB();
