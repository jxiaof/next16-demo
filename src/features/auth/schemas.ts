import { z } from "zod";

// 简化的密码规则：只需要 6 位即可
const passwordSchema = z.string().min(6, "密码至少 6 个字符");

// 登录表单 Schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "用户名不能为空")
    .min(3, "用户名至少 3 个字符"),
  password: passwordSchema,
});

// 注册表单 Schema
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "用户名不能为空")
      .min(3, "用户名至少 3 个字符")
      .max(20, "用户名最多 20 个字符")
      .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
    email: z
      .string()
      .min(1, "邮箱不能为空")
      .email("请输入有效的邮箱地址"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "请确认密码"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

// 类型推导
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
