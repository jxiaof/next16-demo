"use server";

import { usersDao } from "@/lib/db/dao/users.dao";
import { getSession } from "@/lib/auth";
import { updateProfileSchema, type UpdateProfileInput } from "../schemas";

export async function updateProfileAction(formData: UpdateProfileInput) {
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
    const existingUserByUsername = await usersDao.findByUsername(username);
    if (existingUserByUsername && existingUserByUsername.id !== session.userId) {
      return {
        success: false,
        message: "用户名已被使用",
      };
    }

    // 4. 检查邮箱是否被其他人使用
    const existingUserByEmail = await usersDao.findByEmail(email);
    if (existingUserByEmail && existingUserByEmail.id !== session.userId) {
      return {
        success: false,
        message: "邮箱已被使用",
      };
    }

    // 5. 更新用户信息
    const updatedUser = await usersDao.update(session.userId, {
      username,
      email,
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "更新失败，用户不存在",
      };
    }

    return {
      success: true,
      message: "个人信息更新成功",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "更新失败，请稍后重试",
    };
  }
}
