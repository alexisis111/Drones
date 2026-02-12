import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig(({ isSsrBuild }) => {
  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      netlifyReactRouter(),
      tsconfigPaths(),
      // Bundle analyzer - only in production builds
      isProduction && !isSsrBuild && visualizer({
        filename: "./build/stats.html",
        open: false, // Don't auto-open in browser
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean), // Remove falsy values

    build: {
      // Enable minification in production
      minify: isProduction ? "terser" : false,
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true, // Remove debugger statements in production
        },
        mangle: true,
      },
      rollupOptions: {
        output: {
          ...(isSsrBuild ? {} : {
            // Split bundles for better caching (only for client build)
            manualChunks: {
              // Separate vendor libraries
              vendor_react: ['react', 'react-dom'],
              vendor_ui: ['framer-motion', 'lucide-react'],
              vendor_three: ['@react-three/fiber', '@react-three/drei'],
            },
          }),
        },
      },
    },

    // Optimize dependencies that are commonly used
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        '@react-three/fiber',
        '@react-three/drei',
      ],
    },
  };
});
