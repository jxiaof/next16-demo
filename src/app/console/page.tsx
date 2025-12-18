"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { LayoutDashboard, Settings, User, FileText, BarChart3, Bell } from "lucide-react";

const menuItems = [
  {
    title: "仪表盘",
    description: "查看整体数据概览",
    icon: BarChart3,
    href: "/console",
  },
  {
    title: "内容管理",
    description: "管理你的内容和文章",
    icon: FileText,
    href: "/console/content",
  },
  {
    title: "个人设置",
    description: "修改账户信息和偏好",
    icon: Settings,
    href: "/console/settings",
  },
  {
    title: "通知中心",
    description: "查看系统通知和消息",
    icon: Bell,
    href: "/console/notifications",
  },
];

export default function ConsolePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  // 未登录时重定向到登录页
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 加载中或未登录时显示加载状态
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">正在检查登录状态...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">欢迎回来，{user?.username}！</h1>
            <p className="text-muted-foreground">这是你的控制台，管理你的所有内容</p>
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>总浏览量</CardDescription>
            <CardTitle className="text-3xl">12,345</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> 较上月
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>内容数量</CardDescription>
            <CardTitle className="text-3xl">48</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3</span> 本月新增
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>订阅用户</CardDescription>
            <CardTitle className="text-3xl">1,024</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> 较上月
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
