"use client";

import { useState, useTransition } from "react";
import { CheckCircle } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { changePasswordAction } from "../actions/change-password";
import { FormItem } from "./form-item";

export function PasswordForm() {
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
