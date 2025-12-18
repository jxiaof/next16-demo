"use server";

import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
});

// 生成随机 token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export async function forgotPasswordAction(formData: { email: string }) {
  try {
    // 1. 验证邮箱格式
    const validationResult = forgotPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues[0]?.message || "邮箱格式错误",
      };
    }

    const { email } = validationResult.data;

    // 2. 查找用户
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // 为了安全，即使用户不存在也返回成功（防止邮箱枚举攻击）
    if (!user) {
      return {
        success: true,
        message: "如果该邮箱已注册，你将收到密码重置邮件",
      };
    }

    // 3. 删除该用户之前的重置令牌
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));

    // 4. 创建新的重置令牌（1小时有效）
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    });

    // 5. 发送重置邮件
    await sendPasswordResetEmail(user.email, token, user.username);

    return {
      success: true,
      message: "如果该邮箱已注册，你将收到密码重置邮件",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "发送重置邮件失败，请稍后重试",
    };
  }
}

// 验证重置令牌是否有效
export async function verifyResetToken(token: string) {
  try {
    const [resetToken] = await db
      .select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
        expiresAt: passwordResetTokens.expiresAt,
      })
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    return !!resetToken;
  } catch {
    return false;
  }
}
