"use server";

import { usersDao } from "@/lib/db/dao/users.dao";
import { hashPassword, verifyPassword, getSession, deleteAllUserSessions, createSession } from "@/lib/auth";
import { sendPasswordChangedEmail } from "@/lib/email";
import { changePasswordSchema, type ChangePasswordInput } from "../schemas";

export async function changePasswordAction(formData: ChangePasswordInput) {
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
    const user = await usersDao.findById(session.userId);
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
    await usersDao.update(user.id, {
      passwordHash,
    });

    // 7. 删除所有会话并创建新会话（强制重新登录）
    await deleteAllUserSessions(user.id);
    await createSession(user.id);

    // 8. 发送密码修改通知邮件
    await sendPasswordChangedEmail(user.email, user.username);

    return {
      success: true,
      message: "密码修改成功，请重新登录",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "修改失败，请稍后重试",
    };
  }
}
