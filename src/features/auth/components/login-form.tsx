"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { loginSchema, type LoginFormData } from "../schemas";
import { useAuth } from "../auth-context";
import { loginAction } from "../actions";

interface FieldErrors {
  username?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    // 前端校验
    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: FieldErrors = {};
      const issues =
        validationResult.error.issues || validationResult.error || [];
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
      const result = await loginAction(formData);

      if (result.success && result.user) {
        login(result.user);
        setSuccessMessage("登录成功！正在跳转...");
        setTimeout(() => {
          router.push("/console");
          router.refresh();
        }, 500);
      } else {
        setGlobalError(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      {globalError && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive animate-slide-up">
          {globalError}
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl bg-success/10 p-4 text-sm text-success animate-slide-up">
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
          disabled={isPending}
          className={errors.username ? "border-destructive" : ""}
        />
        {errors.username && (
          <p className="text-xs text-destructive animate-fade-in">{errors.username}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            密码
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
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
          disabled={isPending}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-xs text-destructive animate-fade-in">{errors.password}</p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "登录中..." : "登录"}
        </Button>
      </div>
    </form>
  );
}

