import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Relative paths — Turbopack on Windows rejects absolute resolveAlias targets. */
const examMathCompileRoot = "./packages/exam-math-compile/src";

const examMathCompileAliases: Record<string, string> = {
  "@mcq/exam-math-compile": `${examMathCompileRoot}/index.ts`,
  "@mcq/exam-math-compile/prepare-latex-content": `${examMathCompileRoot}/prepare-latex-content.ts`,
  "@mcq/exam-math-compile/math-latex-repairs": `${examMathCompileRoot}/math-latex-repairs.ts`,
};

const examMathCompileAliasesAbsolute: Record<string, string> = {
  "@mcq/exam-math-compile": path.join(rootDir, examMathCompileRoot, "index.ts"),
  "@mcq/exam-math-compile/prepare-latex-content": path.join(
    rootDir,
    examMathCompileRoot,
    "prepare-latex-content.ts",
  ),
  "@mcq/exam-math-compile/math-latex-repairs": path.join(
    rootDir,
    examMathCompileRoot,
    "math-latex-repairs.ts",
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
