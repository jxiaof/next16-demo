"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { loginSchema, type LoginFormData } from "../schemas";
import { useAuth } from "../auth-context";

interface FieldErrors {
  username?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setGlobalError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setSuccessMessage("");

    // 使用 Zod 进行表单校验
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
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

      // 登录验证：只有 admin/admin 才能成功
      if (formData.username === "admin" && formData.password === "admin") {
        login({
          id: "1",
          username: "admin",
          email: "admin@example.com",
        });
        setSuccessMessage("登录成功！正在跳转...");
        setTimeout(() => {
          router.push("/console");
        }, 1000);
      } else {
        setGlobalError("用户名或密码错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {globalError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {globalError}
        </div>
      )}
      {successMessage && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
          {successMessage}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          用户名
        </label>
        <Input
          id="username"
          type="text"
          placeholder="请输入用户名"
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
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            密码
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            忘记密码？
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="请输入密码"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          disabled={isLoading}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "登录中..." : "登录"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        提示：使用 admin / admin 登录
      </p>
    </form>
  );
}
