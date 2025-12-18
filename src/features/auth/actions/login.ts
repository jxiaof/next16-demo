"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword, createSession } from "@/lib/auth";
import { loginSchema } from "../schemas";
import type { AuthResult } from "../types";
import { eq } from "drizzle-orm";

export async function loginAction(formData: {
  username: string;
  password: string;
}): Promise<AuthResult> {
  try {
    // 1. 验证表单数据
    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0];
      return {
        success: false,
        message: firstError?.message || "表单验证失败",
      };
    }

    const { username, password } = validationResult.data;

    // 2. 查找用户
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      return { success: false, message: "用户名或密码错误" };
    }

    // 3. 检查用户是否激活
    if (!user.isActive) {
      return { success: false, message: "账户已被禁用" };
    }

    // 4. 验证密码
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, message: "用户名或密码错误" };
    }

    // 5. 创建会话
    await createSession(user.id);

    return {
      success: true,
      message: "登录成功",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "登录失败，请稍后重试",
    };
  }
}
