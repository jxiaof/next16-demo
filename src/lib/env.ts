import { z } from "zod";

// 环境变量 Schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("myapp_dev"),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // Auth
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),

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
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = getEnv();
export type Env = z.infer<typeof envSchema>;
