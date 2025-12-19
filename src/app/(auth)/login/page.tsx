import Link from "next/link";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">登录</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            登录你的账户
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          没有账户？{" "}
          <Link href="/register" className="text-primary hover:underline">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
