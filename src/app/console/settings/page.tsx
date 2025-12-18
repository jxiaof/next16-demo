"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Save, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import {
  updateProfileAction,
  changePasswordAction,
} from "@/features/auth/actions";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, refreshUser } = useAuth();

  // 个人资料表单
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isProfilePending, startProfileTransition] = useTransition();

  // 修改密码表单
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isPasswordPending, startPasswordTransition] = useTransition();

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  // 未登录时重定向
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 处理个人资料更新
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    startProfileTransition(async () => {
      const result = await updateProfileAction(profileData);

      if (result.success) {
        setProfileSuccess(result.message);
        await refreshUser(); // 刷新用户状态
      } else {
        setProfileError(result.message);
      }
    });
  };

  // 处理密码修改
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // 前端校验
    if (!passwordData.currentPassword) {
      setPasswordError("请输入当前密码");
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordError("请输入新密码");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("两次输入的密码不一致");
      return;
    }

    startPasswordTransition(async () => {
      const result = await changePasswordAction(passwordData);

      if (result.success) {
        setPasswordSuccess(result.message);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(result.message);
      }
    });
  };

  // 加载中
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">正在加载...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <Link
          href="/console"
          className="rounded-md p-2 hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">账户设置</h1>
          <p className="text-muted-foreground">管理你的个人信息和安全设置</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 个人资料卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>个人资料</CardTitle>
                <CardDescription>更新你的用户名和邮箱</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {profileError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  {profileSuccess}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  用户名
                </label>
                <Input
                  id="username"
                  type="text"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  disabled={isProfilePending}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  邮箱
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  disabled={isProfilePending}
                />
              </div>

              <Button
                type="submit"
                disabled={isProfilePending}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {isProfilePending ? "保存中..." : "保存更改"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 修改密码卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Lock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle>修改密码</CardTitle>
                <CardDescription>定期更换密码以保护账户安全</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="currentPassword"
                  className="text-sm font-medium"
                >
                  当前密码
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  disabled={isPasswordPending}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  新密码
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="至少 8 位，含大小写字母和数字"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  disabled={isPasswordPending}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  确认新密码
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入新密码"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  disabled={isPasswordPending}
                />
              </div>

              <Button
                type="submit"
                disabled={isPasswordPending}
                className="w-full"
              >
                <Lock className="mr-2 h-4 w-4" />
                {isPasswordPending ? "修改中..." : "修改密码"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
