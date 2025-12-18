"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { logoutAction } from "@/features/auth/actions";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    startTransition(async () => {
      logout(); // 先清除本地状态
      await logoutAction(); // 再清除服务器会话
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border bg-background p-1 pr-3 text-sm transition-colors hover:bg-accent"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
        <span className="max-w-[80px] truncate font-medium">
          {user?.username}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border bg-background shadow-lg">
          {/* 用户信息 */}
          <div className="border-b px-4 py-3">
            <p className="font-medium">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          {/* 菜单项 */}
          <div className="p-1">
            <Link
              href="/console"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              控制台
            </Link>
            <Link
              href="/console/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              个人设置
            </Link>
          </div>

          {/* 登出 */}
          <div className="border-t p-1">
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "登出中..." : "退出登录"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

