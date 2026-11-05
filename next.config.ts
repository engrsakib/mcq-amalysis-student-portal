import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Relative paths — Turbopack on Windows rejects absolute resolveAlias targets. */
const examMathCompileAliases: Record<string, string> = {
  "@mcq/exam-math-compile": "../shared/exam-math-compile/src/index.ts",
  "@mcq/exam-math-compile/prepare-latex-content":
    "../shared/exam-math-compile/src/prepare-latex-content.ts",
  "@mcq/exam-math-compile/math-latex-repairs":
    "../shared/exam-math-compile/src/math-latex-repairs.ts",
};

const examMathCompileAliasesAbsolute: Record<string, string> = {
  "@mcq/exam-math-compile": path.join(
    rootDir,
    "../shared/exam-math-compile/src/index.ts",
  ),
  "@mcq/exam-math-compile/prepare-latex-content": path.join(
    rootDir,
    "../shared/exam-math-compile/src/prepare-latex-content.ts",
  ),
  "@mcq/exam-math-compile/math-latex-repairs": path.join(
    rootDir,
    "../shared/exam-math-compile/src/math-latex-repairs.ts",
  ),
};

const nextConfig: NextConfig = {
  transpilePackages: ["@mcq/exam-math-compile"],
  turbopack: {
    resolveAlias: examMathCompileAliases,
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...examMathCompileAliasesAbsolute,
    };
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
      ".jsx": [".tsx", ".jsx"],
      ...config.resolve.extensionAlias,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
