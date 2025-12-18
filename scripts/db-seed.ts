import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as dotenv from "dotenv";
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
    // 示例：创建测试用户
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, "admin"));

    if (existingUser.length === 0) {
      await db.insert(schema.users).values({
        username: "admin",
        email: "admin@example.com",
        // 注意：实际使用时应该对密码进行哈希处理
        passwordHash: "hashed_password_placeholder",
        isActive: true,
      });
      console.log("✅ Created admin user");
    } else {
      console.log("ℹ️  Admin user already exists, skipping...");
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
