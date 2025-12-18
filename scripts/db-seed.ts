import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import * as schema from "../src/lib/db/schema";

// 加载环境变量
dotenv.config({ path: ".env.local" });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined");
    process.exit(1);
  }

  console.log("🌱 Starting database seeding...");

  const conn = postgres(databaseUrl, { max: 1 });
  const db = drizzle(conn, { schema });

  try {
    // 创建管理员用户
    const existingAdmin = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, "admin"));

    if (existingAdmin.length === 0) {
      // 使用真实的密码哈希
      const passwordHash = await bcrypt.hash("Admin123", 12);

      await db.insert(schema.users).values({
        username: "admin",
        email: "admin@example.com",
        passwordHash,
        isActive: true,
      });
      console.log("✅ Created admin user (password: Admin123)");
    } else {
      console.log("ℹ️  Admin user already exists, skipping...");
    }

    // 创建测试用户
    const existingTest = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, "testuser"));

    if (existingTest.length === 0) {
      const passwordHash = await bcrypt.hash("Test1234", 12);

      await db.insert(schema.users).values({
        username: "testuser",
        email: "test@example.com",
        passwordHash,
        isActive: true,
      });
      console.log("✅ Created test user (password: Test1234)");
    } else {
      console.log("ℹ️  Test user already exists, skipping...");
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

main();
