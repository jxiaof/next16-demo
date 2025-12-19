"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { forgotPasswordAction } from "@/features/auth/actions";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("请输入邮箱地址");
      return;
    }

    startTransition(async () => {
      const result = await forgotPasswordAction({ email });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">邮件已发送</h1>
            <p className="text-sm text-muted-foreground">
              如果该邮箱已注册，你将收到一封包含密码重置链接的邮件。
              请检查你的收件箱（包括垃圾邮件文件夹）。
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                返回登录
              </Button>
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              使用其他邮箱
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">找回密码</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            输入你的注册邮箱，我们将发送重置链接
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              邮箱地址
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "发送中..." : "发送重置链接"}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            返回登录
          </Link>
        </div>
      </div>
    </div>
  );
}
