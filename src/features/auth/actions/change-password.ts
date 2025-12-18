"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword, verifyPassword, getSession, deleteAllUserSessions, createSession } from "@/lib/auth";
import { sendPasswordChangedEmail } from "@/lib/email";
import { eq } from "drizzle-orm";
import { z } from "zod";

// 简化的密码校验：只需要 6 位即可
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(6, "新密码至少 6 个字符"),
    confirmPassword: z.string().min(1, "请确认新密码"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    // 1. 验证表单
    const validationResult = changePasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        message: firstError?.message || "表单验证失败",
      };
    }

    const { currentPassword, newPassword } = validationResult.data;

    // 2. 获取当前登录用户
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "请先登录",
      };
    }

    // 3. 获取用户信息
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: "用户不存在",
      };
    }

    // 4. 验证当前密码
    const isValidPassword = await verifyPassword(
      currentPassword,
      user.passwordHash
    );
    if (!isValidPassword) {
      return {
        success: false,
        message: "当前密码错误",
      };
    }

    // 5. 检查新密码是否与当前密码相同
    const isSamePassword = await verifyPassword(newPassword, user.passwordHash);
    if (isSamePassword) {
      return {
        success: false,
        message: "新密码不能与当前密码相同",
      };
    }

    // 6. 更新密码
    const passwordHash = await hashPassword(newPassword);
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // 7. 删除所有会话并创建新会话（强制重新登录）
    await deleteAllUserSessions(user.id);
    await createSession(user.id);

    // 8. 发送密码修改通知邮件
    await sendPasswordChangedEmail(user.email, user.username);

    return {
      success: true,
      message: "密码修改成功",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "修改密码失败，请稍后重试",
    };
  }
}
