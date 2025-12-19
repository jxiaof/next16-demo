"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, Suspense } from "react";
import { KeyRound, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { resetPasswordAction, verifyResetToken } from "@/features/auth/actions";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isPending, startTransition] = useTransition();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // 验证 token 是否有效
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setIsValidating(false);
        setIsValidToken(false);
        return;
      }

      const isValid = await verifyResetToken(token);
      setIsValidToken(isValid);
      setIsValidating(false);
    }

    validateToken();
  }, [token]);

  const handleChange = (field: "password" | "confirmPassword", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // 基本验证
    const errors: typeof fieldErrors = {};
    if (!formData.password) {
      errors.password = "请输入新密码";
    } else if (formData.password.length < 8) {
      errors.password = "密码至少 8 个字符";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "请确认新密码";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "两次输入的密码不一致";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message);
      }
    });
  };

  // 验证中
  if (isValidating) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">正在验证链接...</p>
        </div>
      </div>
    );
  }

  // Token 无效
  if (!isValidToken) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">链接无效或已过期</h1>
            <p className="text-sm text-muted-foreground">
              此密码重置链接无效或已过期，请重新申请。
            </p>
          </div>
          <Link href="/forgot-password">
            <Button className="w-full">重新申请</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 重置成功
  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">密码重置成功</h1>
            <p className="text-sm text-muted-foreground">
              你的密码已成功重置，请使用新密码登录。
            </p>
          </div>
          <Link href="/login">
            <Button className="w-full">前往登录</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 重置表单
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">重置密码</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            请输入你的新密码
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              新密码
            </label>
            <Input
              id="password"
              type="password"
              placeholder="至少 8 位，含大小写字母和数字"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              disabled={isPending}
              className={fieldErrors.password ? "border-destructive" : ""}
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              确认新密码
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="再次输入新密码"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              disabled={isPending}
              className={fieldErrors.confirmPassword ? "border-destructive" : ""}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "重置中..." : "重置密码"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
