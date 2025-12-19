"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 确保组件已挂载，避免水合错误
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 relative"
      onClick={toggleTheme}
      title={`当前模式: ${theme === "system" ? "自动" : theme === "dark" ? "深色" : "浅色"}`}
    >
      <Sun className={cn("h-[1.2rem] w-[1.2rem] transition-all", theme === "light" ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute")} />
      <Moon className={cn("h-[1.2rem] w-[1.2rem] transition-all", theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute")} />
      <Laptop className={cn("h-[1.2rem] w-[1.2rem] transition-all", theme === "system" ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute")} />
      <span className="sr-only">切换主题 (当前: {theme})</span>
    </Button>
  );
}
