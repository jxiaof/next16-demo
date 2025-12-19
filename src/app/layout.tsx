import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar, Footer, ThemeProvider } from "@/components/shared";
import { AuthProvider } from "@/features/auth";

/**
 * Geist Sans - 企业级无衬线字体
 * 用作回退字体，补充系统原生字体的不足
 * 仅加载 latin 子集以优化性能
 * 
 * 注: 中文文本由 CSS 中的回退链处理 (PingFang SC, Microsoft YaHei 等)
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono - 等宽字体
 * 用于代码块、表单数据、数值显示
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coconut - 企业级解决方案",
  description: "专业的企业级解决方案，助力您的业务增长",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/* H5 兼容性视口配置 (Next.js 14+) */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: "cover",           /* iOS 刘海屏适配 */
  userScalable: false,
  themeColor: "#f97316",          /* 主橙色 */
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
