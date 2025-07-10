import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

import CopyWebpackPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {  /* config options here */
  // Move from experimental.turbo to turbopack (the recommended approach)
  turbopack: {
    rules: {
      // Specify how to handle PDF.js worker files
      "*.worker.min.js": {
        // Use asset loader for worker files
        loaders: ["asset"],
        as: "static/worker/[name].[hash].[ext]",
      },
    },
  },
  
  // This is still needed for production builds which use webpack
  webpack: (config, { dev, isServer, nextRuntime }) => {
    // PDF.js worker configuration
    if (!isServer && nextRuntime !== "edge") {
      const workerPath = path.join(
        process.cwd(),
        "node_modules",
        "pdfjs-dist",
        "build",
        "pdf.worker.min.js"
      );

      // For production builds, copy the worker file directly
      if (!dev && fs.existsSync(workerPath)) {
        const outputPath = path.join(
          process.cwd(),
          ".next",
          "static",
          "worker"
        );
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath, { recursive: true });
        }
        
        // Copy the worker file
        fs.copyFileSync(
          workerPath,
          path.join(outputPath, "pdf.worker.min.js")
        );
      }
      
      // Use CopyWebpackPlugin to copy the worker file during both development and production
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: workerPath,
              to: path.join("static", "worker"),
            },
          ],
        })
      );
      
      // For development, use webpack to copy the file
      config.module.rules.push({
        test: /pdf\.worker\.min\.js$/,
        type: "asset/resource",
        generator: {
          filename: "static/worker/pdf.worker.min.js",
        },
      });    }

    return config;
  },
};

export default nextConfig;
