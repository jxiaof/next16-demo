/**
 * 设置子路由 Layout
 * 
 * 为设置页面提供特定的样式和组织
 */

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      {children}
    </div>
  );
}
