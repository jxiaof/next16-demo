"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { registerSchema, type RegisterFormData } from "../schemas";
import { CheckCircle } from "lucide-react";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // 使用 Zod 进行表单校验
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      // Zod v4 使用 result.error.issues 而不是 result.error.errors
      const issues = result.error.issues || result.error || [];
      issues.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 校验通过，显示注册成功
      setSuccessMessage("注册成功！请前往登录页面登录。");
      // 重置表单
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 注册成功后显示成功页面
  if (successMessage) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
            注册成功！
          </h3>
          <p className="text-sm text-muted-foreground">
            你的账户已创建成功，请前往登录页面登录。
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full">前往登录</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          用户名
        </label>
        <Input
          id="username"
          type="text"
          placeholder="3-20 个字符，字母数字下划线"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          disabled={isLoading}
          className={errors.username ? "border-destructive" : ""}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isLoading}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          密码
        </label>
        <Input
          id="password"
          type="password"
          placeholder="至少 8 位，含大小写字母和数字"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          disabled={isLoading}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          确认密码
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="再次输入密码"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          disabled={isLoading}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "注册中..." : "注册"}
      </Button>
    </form>
  );
}
