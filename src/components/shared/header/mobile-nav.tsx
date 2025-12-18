"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  FileText,
  CreditCard,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { logoutAction } from "@/features/auth/actions";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/market", label: "Market", icon: ShoppingBag },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    setIsOpen(false);
    startTransition(async () => {
      logout();
      await logoutAction();
    });
  };

  return (
    <>
      {/* 菜单按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* 移动端抽屉 */}
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 top-14 z-40 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* 导航菜单 */}
          <nav className="fixed inset-x-0 top-14 z-50 border-b bg-background p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                >
                  <link.icon className="h-4 w-4 text-muted-foreground" />
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />

              {isAuthenticated ? (
                <>
                  {/* 用户信息 */}
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    当前用户: {user?.username}
                  </div>
                  <Link
                    href="/console"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Console
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    {isPending ? "登出中..." : "登出"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                  >
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    登录
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
                  >
                    <UserPlus className="h-4 w-4" />
                    注册
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}

