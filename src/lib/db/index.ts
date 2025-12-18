import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 延迟加载环境变量，避免在构建时出错
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined");
  }
  return url;
};

// 创建数据库连接（单例模式）
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// 生产环境配置 SSL，开发环境不需要
const conn = globalForDb.conn ?? postgres(getDatabaseUrl(), {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  max: 1, // Serverless 环境推荐设置为 1
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
export { schema };
export type Database = typeof db;
