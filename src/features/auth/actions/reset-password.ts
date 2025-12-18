"use server";

import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth";
import { sendPasswordChangedEmail } from "@/lib/email";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "无效的重置令牌"),
    password: z
      .string()
      .min(8, "密码至少 8 个字符")
      .regex(/[A-Z]/, "密码必须包含至少一个大写字母")
      .regex(/[a-z]/, "密码必须包含至少一个小写字母")
      .regex(/[0-9]/, "密码必须包含至少一个数字"),
    confirmPassword: z.string().min(1, "请确认密码"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export async function resetPasswordAction(formData: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    // 1. 验证表单
    const validationResult = resetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        message: firstError?.message || "表单验证失败",
      };
    }

    const { token, password } = validationResult.data;

    // 2. 查找有效的重置令牌
    const [resetToken] = await db
      .select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
      })
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!resetToken) {
      return {
        success: false,
        message: "重置链接已过期或无效，请重新申请",
      };
    }

    // 3. 获取用户信息
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, resetToken.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: "用户不存在",
      };
    }

    // 4. 更新密码
    const passwordHash = await hashPassword(password);
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // 5. 删除重置令牌
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));

    // 6. 发送密码修改通知邮件
    await sendPasswordChangedEmail(user.email, user.username);

    return {
      success: true,
      message: "密码重置成功，请使用新密码登录",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "重置密码失败，请稍后重试",
    };
  }
}
