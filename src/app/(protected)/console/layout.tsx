/**
 * Console 仪表板 Layout
 * 
 * 提供仪表板特定的布局（如顶部信息栏）
 */

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
