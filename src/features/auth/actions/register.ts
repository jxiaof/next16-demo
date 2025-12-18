"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "../schemas";
import type { AuthResult } from "../types";
import { eq, or } from "drizzle-orm";

export async function registerAction(formData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResult> {
  try {
    // 1. 验证表单数据
    const validationResult = registerSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0];
      return {
        success: false,
        message: firstError?.message || "表单验证失败",
      };
    }

    const { username, email, password } = validationResult.data;

    // 2. 检查用户名或邮箱是否已存在
    const existingUser = await db
      .select({ id: users.id, username: users.username, email: users.email })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .limit(1);

    if (existingUser.length > 0) {
      const existing = existingUser[0];
      if (existing.username === username) {
        return { success: false, message: "用户名已被注册" };
      }
      if (existing.email === email) {
        return { success: false, message: "邮箱已被注册" };
      }
    }

    // 3. 加密密码
    const passwordHash = await hashPassword(password);

    // 4. 创建用户
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        passwordHash,
        isActive: true,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
      });

    return {
      success: true,
      message: "注册成功",
      user: newUser,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "注册失败，请稍后重试",
    };
  }
}
