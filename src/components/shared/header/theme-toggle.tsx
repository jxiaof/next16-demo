"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

// 使用 useSyncExternalStore 来同步外部存储（localStorage）的主题状态
function getThemeSnapshot(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  if (savedTheme) return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

function subscribeToTheme(callback: () => void) {
  // 监听 storage 事件以响应其他标签页的主题变化
  window.addEventListener("storage", callback);
  // 监听系统主题偏好变化
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    mediaQuery.removeEventListener("change", callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);

  // 使用 useCallback 包装初始化，并在组件挂载后立即应用主题
  const applyTheme = useCallback((newTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, []);

  // 组件挂载后应用主题
  if (typeof window !== "undefined" && !mounted) {
    setMounted(true);
    applyTheme(theme);
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    // 触发 storage 事件以便 useSyncExternalStore 更新
    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
  };

  // 防止水合不匹配
  if (!mounted) {
    return (
      <button
        className="rounded-md p-2 hover:bg-accent"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-accent"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
