import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // 使用 standalone 输出以减少镜像大小
  output: "standalone",
};

export default nextConfig;
