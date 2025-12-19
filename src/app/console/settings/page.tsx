"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { ProfileForm, PasswordForm } from "@/features/user";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 设置项 Tab 配置
type SettingsTab = "profile" | "password";

interface TabConfig {
  id: SettingsTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
}

const tabs: TabConfig[] = [
  {
    id: "profile",
    label: "个人资料",
    description: "管理你的用户名和邮箱",
    icon: User,
    iconBgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "password",
    label: "修改密码",
    description: "更新你的账户密码",
    icon: Lock,
    iconBgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

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

  // 渲染当前 Tab 内容
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileForm key={`${user.username}-${user.email}`} user={user} onSuccess={refreshUser} />;
      case "password":
        return <PasswordForm />;
      default:
        return null;
    }
  };

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

      {/* 设置内容 */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 侧边栏 - Tab 导航 */}
        <aside className="w-full shrink-0 lg:w-64">
          <nav className="space-y-1 rounded-lg border bg-card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
              >
                <div className={cn("rounded-md p-1.5", tab.iconBgColor)}>
                  <tab.icon className={cn("h-4 w-4", tab.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tab.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {tab.description}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    activeTab === tab.id && "text-foreground"
                  )}
                />
              </button>
            ))}
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 rounded-lg border bg-card p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
