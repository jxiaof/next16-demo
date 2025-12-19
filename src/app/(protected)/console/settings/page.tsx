"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { SettingsTabs } from "@/components/shared";
import { useAuth } from "@/features/auth";
import { ProfileForm, PasswordForm } from "@/features/user";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, refreshUser } = useAuth();

  // 未登录时重定向
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 加载中
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">正在加载...</p>
      </div>
    );
  }

  const settingsTabs = [
    {
      id: "profile",
      label: "个人资料",
      description: "管理你的用户名和邮箱",
      icon: User,
      content: (
        <ProfileForm 
          key={`${user.username}-${user.email}`} 
          user={user} 
          onSuccess={refreshUser} 
        />
      ),
    },
    {
      id: "password",
      label: "修改密码",
      description: "更新你的账户密码",
      icon: Lock,
      content: <PasswordForm />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <Link href="/console">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">账户设置</h1>
          <p className="text-sm text-muted-foreground">
            管理你的账户信息和安全设置
          </p>
        </div>
      </div>

      {/* 设置内容 - 上下标签布局 */}
      <SettingsTabs 
        tabs={settingsTabs}
        defaultValue="profile"
        orientation="horizontal"
      />
    </div>
  );
}
