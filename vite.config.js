import vue from "@vitejs/plugin-vue";
import {
  resolve
} from "path";
import {
  defineConfig
} from "vite";
const pathResolve = (dir) => {
  return resolve(__dirname, ".", dir);
};

const alias = {
  "@": pathResolve("src"),
};

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias,
  },
  server: {
    port: 3002,
    host: "0.0.0.0",
    open: true,
    // proxy: {
    //   // 代理配置
    //   "/api": {
    //     target: "http://8.131.240.89:5050",
    //     ws: true,
    //     changeOrigin: true, //允许跨域
    //   },
    // },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
  plugins: [vue()],
});