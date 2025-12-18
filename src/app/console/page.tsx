"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { useAuth } from "@/features/auth";
import {
  updateProfileAction,
  changePasswordAction,
} from "@/features/auth/actions";
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
    description: "更新你的登录密码",
    icon: Lock,
    iconBgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
];

// 表单项组件 - 统一布局
function FormItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// 个人资料表单组件
function ProfileForm({
  user,
  onSuccess,
}: {
  user: { username: string; email: string };
  onSuccess: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  // 直接使用 user 作为初始值，通过父组件的 key 来重置状态
  const [profileData, setProfileData] = useState({
    username: user.username,
    email: user.email,
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isProfilePending, startProfileTransition] = useTransition();

  const handleCancel = () => {
    setIsEditing(false);
    setProfileError("");
    setProfileSuccess("");
    setProfileData({
      username: user.username,
      email: user.email,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    startProfileTransition(async () => {
      const result = await updateProfileAction(profileData);

      if (result.success) {
        setProfileSuccess(result.message);
        setIsEditing(false);
        await onSuccess();
      } else {
        setProfileError(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 标题和操作按钮 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">个人资料</h2>
          <p className="text-sm text-muted-foreground">
            管理你的基本账户信息
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="shrink-0"
          >
            <Pencil className="mr-2 h-4 w-4" />
            修改
          </Button>
        )}
      </div>

      {/* 提示信息 */}
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

      {/* 表单内容 */}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <FormItem label="用户名">
          {isEditing ? (
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
              className="max-w-md"
            />
          ) : (
            <p className="py-2 text-sm">{user.username}</p>
          )}
        </FormItem>

        <FormItem label="邮箱">
          {isEditing ? (
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
              className="max-w-md"
            />
          ) : (
            <p className="py-2 text-sm">{user.email}</p>
          )}
        </FormItem>

        {/* 编辑模式下的操作按钮 */}
        {isEditing && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isProfilePending}
              className="min-w-[120px]"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isProfilePending}
              className="min-w-[120px]"
            >
              {isProfilePending ? "保存中..." : "确认更改"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

// 修改密码表单组件
function PasswordForm() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // 前端验证
    if (passwordData.newPassword.length < 6) {
      setPasswordError("新密码至少需要 6 个字符");
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

  const handleCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">修改密码</h2>
        <p className="text-sm text-muted-foreground">
          为了账户安全，请定期更换密码
        </p>
      </div>

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

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <FormItem label="当前密码">
          <Input
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            disabled={isPasswordPending}
            placeholder="请输入当前密码"
            className="max-w-md"
          />
        </FormItem>

        <FormItem label="新密码">
          <Input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            disabled={isPasswordPending}
            placeholder="至少 6 个字符"
            className="max-w-md"
          />
        </FormItem>

        <FormItem label="确认新密码">
          <Input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            disabled={isPasswordPending}
            placeholder="再次输入新密码"
            className="max-w-md"
          />
        </FormItem>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPasswordPending}
            className="min-w-[120px]"
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={isPasswordPending}
            className="min-w-[120px]"
          >
            {isPasswordPending ? "保存中..." : "确认更改"}
          </Button>
        </div>
      </form>
    </div>
  );
}

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
