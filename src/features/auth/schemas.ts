import { z } from "zod";

// 登录表单 Schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "用户名不能为空")
    .min(3, "用户名至少 3 个字符"),
  password: z
    .string()
    .min(1, "密码不能为空")
    .min(4, "密码至少 4 个字符"),
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
    password: z
      .string()
      .min(1, "密码不能为空")
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

// 类型推导
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
