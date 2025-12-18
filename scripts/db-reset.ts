import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as dotenv from "dotenv";

// 加载环境变量
dotenv.config({ path: ".env.local" });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined");
    process.exit(1);
  }

  // 安全检查：只允许在开发环境执行
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Cannot reset database in production!");
    process.exit(1);
  }

  console.log("⚠️  WARNING: This will delete all data in the database!");
  console.log("🔄 Starting database reset...");

  const conn = postgres(databaseUrl, { max: 1 });
  const db = drizzle(conn);

  try {
    // 删除所有表（按依赖顺序）
    await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    console.log("✅ All tables dropped successfully!");
    console.log("ℹ️  Run 'pnpm db:migrate' to recreate tables");
    console.log("ℹ️  Run 'pnpm db:seed' to populate initial data");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

main();
