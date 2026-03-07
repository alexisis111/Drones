import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
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
      tsconfigPaths(),
      // Bundle analyzer - only in production builds
      isProduction && !isSsrBuild && visualizer({
        filename: "./build/stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean),

    build: {
      // Enable minification in production
      minify: isProduction ? "terser" : false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2,
        },
        mangle: true,
      },
      // Mobile-first: reduce chunk size
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          ...(isSsrBuild ? {} : {
            // Split bundles for better caching (only for client build)
            manualChunks: {
              // Critical path - minimal for fast FCP
              vendor_react: ['react', 'react-dom', 'react-router'],
              // Non-critical - lazy loaded
              vendor_motion: ['framer-motion'],
              vendor_icons: ['lucide-react'],
              // 3D - heaviest, lazy loaded on demand
              vendor_three: ['@react-three/fiber', '@react-three/drei'],
            },
            // Optimize chunk naming for better caching
            entryFileNames: "assets/[name]-[hash].js",
            chunkFileNames: "assets/[name]-[hash].js",
            assetFileNames: "assets/[name]-[hash].[ext]",
          }),
        },
      },
      // Target modern browsers for smaller bundles
      target: "es2020",
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
      ],
      // Don't pre-optimize heavy libs
      exclude: [
        'framer-motion',
        '@react-three/fiber',
        '@react-three/drei',
      ],
    },

    // Improve dev server performance
    server: {
      warmup: {
        clientFiles: [
          './app/root.tsx',
          './app/routes/home.tsx',
        ],
      },
    },
  };
});
