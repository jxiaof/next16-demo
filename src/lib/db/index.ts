import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

// 创建数据库连接（单例模式）
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// 优先使用环境变量中的 SSL 配置，生产环境默认开启
const sslConfig = env.DB_SSL || env.NODE_ENV === "production" ? "require" : false;

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL, {
  ssl: sslConfig,
  max: 1, // Serverless 环境推荐设置为 1
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
export { schema };
export type Database = typeof db;
