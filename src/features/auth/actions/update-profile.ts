"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, not } from "drizzle-orm";
import { z } from "zod";

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少 3 个字符")
    .max(20, "用户名最多 20 个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  email: z.string().email("请输入有效的邮箱地址"),
});

export async function updateProfileAction(formData: {
  username: string;
  email: string;
}) {
  try {
    // 1. 验证表单
    const validationResult = updateProfileSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        message: firstError?.message || "表单验证失败",
      };
    }

    const { username, email } = validationResult.data;

    // 2. 获取当前登录用户
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "请先登录",
      };
    }

    // 3. 检查用户名是否被其他人使用
    const [existingUsername] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.username, username), not(eq(users.id, session.userId))))
      .limit(1);

    if (existingUsername) {
      return {
        success: false,
        message: "用户名已被使用",
      };
    }

    // 4. 检查邮箱是否被其他人使用
    const [existingEmail] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, email), not(eq(users.id, session.userId))))
      .limit(1);

    if (existingEmail) {
      return {
        success: false,
        message: "邮箱已被使用",
      };
    }

    // 5. 更新用户信息
    const [updatedUser] = await db
      .update(users)
      .set({
        username,
        email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
      });

    return {
      success: true,
      message: "个人信息更新成功",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "更新失败，请稍后重试",
    };
  }
}
