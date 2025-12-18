import Link from "next/link";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">注册</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            创建一个新账户
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          已有账户？{" "}
          <Link href="/login" className="text-primary hover:underline">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
