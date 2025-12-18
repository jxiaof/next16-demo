"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { registerSchema, type RegisterFormData } from "../schemas";
import { registerAction } from "../actions";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setGlobalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");

    // 前端校验
    const validationResult = registerSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: FieldErrors = {};
      const issues =
        validationResult.error.issues || validationResult.error.errors || [];
      issues.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // 调用 Server Action
    startTransition(async () => {
      const result = await registerAction(formData);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setGlobalError(result.message);
      }
    });
  };

  // 注册成功后显示成功页面
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center animate-scale-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-bounce-in">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-success">
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
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      {globalError && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive animate-slide-up">
          {globalError}
        </div>
      )}

      <div className="space-y-2 animate-slide-up stagger-1">
        <label htmlFor="username" className="text-sm font-medium">
          用户名
        </label>
        <Input
          id="username"
          type="text"
          placeholder="3-20 个字符，字母数字下划线"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          disabled={isPending}
          className={errors.username ? "border-destructive" : ""}
        />
        {errors.username && (
          <p className="text-xs text-destructive animate-fade-in">{errors.username}</p>
        )}
      </div>

      <div className="space-y-2 animate-slide-up stagger-2">
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isPending}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive animate-fade-in">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2 animate-slide-up stagger-3">
        <label htmlFor="password" className="text-sm font-medium">
          密码
        </label>
        <Input
          id="password"
          type="password"
          placeholder="至少 6 个字符"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          disabled={isPending}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-xs text-destructive animate-fade-in">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2 animate-slide-up stagger-4">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          确认密码
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="再次输入密码"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          disabled={isPending}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive animate-fade-in">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="animate-slide-up stagger-5 pt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "注册中..." : "注册"}
        </Button>
      </div>
    </form>
  );
}

