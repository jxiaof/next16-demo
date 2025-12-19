"use client";

import { useState, useTransition } from "react";
import { Pencil, CheckCircle } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { updateProfileAction } from "../actions/update-profile";
import { FormItem } from "./form-item";

interface ProfileFormProps {
  user: { username: string; email: string };
  onSuccess: () => Promise<void>;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
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
