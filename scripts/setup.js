#!/usr/bin/env node

import { execSync, spawn } from "child_process";
import { platform } from "os";

console.log("🔧 Atomic Settlement Setup");
console.log("==========================");

// Check if MongoDB is running
function checkMongoDB() {
  try {
    execSync("mongod --version", { stdio: "pipe" });
    console.log("✅ MongoDB is installed");

    // Try to connect to MongoDB
    try {
      execSync("mongo --eval \"db.adminCommand('ismaster')\" --quiet", {
        stdio: "pipe",
      });
      console.log("✅ MongoDB is running");
      return true;
    } catch (error) {
      console.log("⚠️  MongoDB is installed but not running");
      return false;
    }
  } catch (error) {
    console.log("❌ MongoDB is not installed");
    console.log("Please install MongoDB:");
    if (platform() === "win32") {
      console.log("  Windows: https://www.mongodb.com/try/download/community");
    } else if (platform() === "darwin") {
      console.log("  macOS: brew install mongodb-community");
    } else {
      console.log("  Linux: Follow the official MongoDB installation guide");
    }
    return false;
  }
}

// Start MongoDB if available
function startMongoDB() {
  if (platform() === "darwin") {
    try {
      execSync("brew services start mongodb-community");
      console.log("✅ Started MongoDB via brew services");
      return true;
    } catch (error) {
      console.log("❌ Failed to start MongoDB via brew services");
      return false;
    }
  } else if (platform() === "win32") {
    console.log("Please start MongoDB manually:");
    console.log("  1. Open Command Prompt as Administrator");
    console.log("  2. Run: net start MongoDB");
    console.log("  Or start mongod.exe directly");
    return false;
  } else {
    console.log("Please start MongoDB manually:");
    console.log("  sudo systemctl start mongod");
    console.log("  Or run: mongod");
    return false;
  }
}

// Check environment file
function checkEnvFile() {
  const fs = require("fs");
  const path = require("path");

  const envPath = path.join(process.cwd(), ".env");
  const envExamplePath = path.join(process.cwd(), ".env.example");

  if (!fs.existsSync(envPath)) {
    console.log("⚠️  .env file not found");
    if (fs.existsSync(envExamplePath)) {
      console.log("Copying .env.example to .env...");
      fs.copyFileSync(envExamplePath, envPath);
      console.log("✅ Created .env file from .env.example");
      console.log("⚠️  Please edit .env with your actual values");
    }
  } else {
    console.log("✅ .env file exists");
  }
}

// Main setup
async function main() {
  console.log("\n📊 Checking MongoDB...");
  const mongoRunning = checkMongoDB();

  if (!mongoRunning) {
    console.log("\n🚀 Attempting to start MongoDB...");
    startMongoDB();
  }

  console.log("\n📄 Checking environment file...");
  checkEnvFile();

  console.log("\n🎉 Setup complete!");
  console.log("Run 'npm run dev' to start the development server");
}

main().catch(console.error);
