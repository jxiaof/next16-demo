import { z } from "zod";

// 构建时生成默认的 32 字符密钥
const defaultBuildSecret = "build_secret_" + "x".repeat(19); // 32 chars total
const defaultBuildDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/myapp_dev";

// 环境变量 Schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().default(defaultBuildDatabaseUrl),
  DB_SSL: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("myapp_dev"),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // Auth
  JWT_SECRET: z.string().min(32).default(defaultBuildSecret),
  SESSION_SECRET: z.string().min(32).default(defaultBuildSecret),

  // API
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// 解析并验证环境变量
function getEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // 在 Vercel 构建时仅警告
    if (process.env.VERCEL_ENV) {
      console.warn("⚠️ Using default environment variables for build");
      return envSchema.parse(process.env);
    } else {
      console.error("❌ Invalid environment variables:");
      console.error(parsed.error.flatten().fieldErrors);
      throw new Error("Invalid environment variables");
    }
  }

  return parsed.data;
}

export const env = getEnv();
export type Env = z.infer<typeof envSchema>;
