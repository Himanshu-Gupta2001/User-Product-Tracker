import { defineConfig, loadEnv } from 'vite';
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import { fileURLToPath, URL } from "url";
import { VitePWA } from 'vite-plugin-pwa'
import VueDevtools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VUE_APP_')

    return {
        define: {
        },
        resolve: {
            alias: [
                { find: '@axios', replacement: fileURLToPath(new URL('./src/assets/libraries/axios@1.6.5.js', import.meta.url)) },
                { find: '@vue-router', replacement: fileURLToPath(new URL('./src/assets/libraries/vue-router@4.2.5.global.js', import.meta.url)) },
                { find: '@vee-validate', replacement: fileURLToPath(new URL('./src/assets/libraries/vee-validate@4.12.4.js', import.meta.url)) },
                { find: '@number-input', replacement: fileURLToPath(new URL('./src/assets/libraries/custom-number-input.js', import.meta.url)) },
                { find: '@flatpickr', replacement: fileURLToPath(new URL('./src/assets/libraries/flatpickr@4.6.13.js', import.meta.url)) },
                { find: '@vue-flatpickr-component', replacement: fileURLToPath(new URL('./src/assets/libraries/vue-flatpickr-component@11.0.4.js', import.meta.url)) },
                { find: '@nprogress', replacement: fileURLToPath(new URL('./src/assets/libraries/nprogress@0.2.0.js', import.meta.url)) },
            ]
        },
        plugins: [
            vue(),
            VueDevtools(),  
            createHtmlPlugin({
                inject: {
                    data: {
                        cdnScript: process.env.NODE_ENV === "production"
                            ? `<script src="/js/vue@3.4.5.global.prod.js"></script>`
                            : `<script src="/js/vue@3.4.5.global.js"></script>`,
                    },
                },
            }),
            VitePWA({
                registerType: 'autoUpdate',
                workbox: {
                    clientsClaim: true,
                    skipWaiting: true
                }
            })
        ],
        server: {
            open: true,
            port: env.VUE_APP_PORT,
            proxy: {
                '/api': {
                    target: env.VUE_APP_SERVER_PROXY,
                    changeOrigin: true,
                }
            }
        },
        esbuild: {
            minify: true
        },
        build: {
            target: 'esnext',
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_debugger: true,
                    drop_console: true,
                },
                mangle: true,
                output: {
                    comments: false,
                },
            },
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[hash:22]-${Date.now()}.js`,
                    chunkFileNames: `assets/[hash:22].js`,
                    assetFileNames: `assets/[hash:22].[ext]`
                }
            }
        }
    }
});