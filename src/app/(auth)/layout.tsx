/**
 * 认证路由组 Layout
 * 
 * 用于登录、注册、密码重置等认证流程
 * 特点: 不需要身份验证即可访问
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
