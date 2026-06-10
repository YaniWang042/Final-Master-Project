import { defineConfig } from 'vite';
import { resolve } from "path";
import fg from 'fast-glob';
import vituum from "vituum";
import pug from '@vituum/vite-plugin-pug'
import pkg from './package.json'
import nav from './navigation.json'
import project from "./project.config.json";

const pugFiles = fg.sync([
  'src/views/**/*.pug',
  '!src/views/templates/**', // Exclude templates
], { cwd: process.cwd() }).map(f => resolve(process.cwd(), f));

export default defineConfig({
     base: "./",
    publicDir: "src/public",
	build: {
        outDir: "dist",
        assetsDir: 'assets',
        emptyOutDir: false,
        rollupOptions: {
            input: [
                ...pugFiles,
                resolve(__dirname, "src/style/*.scss"),
                resolve(__dirname, "src/js/main.js"),
            ],
            output: {
                entryFileNames: 'assets/js/[name].js',
                chunkFileNames: 'assets/js/[name].js',

                assetFileNames: (assetInfo) => {
                    if (/\.css$/.test(assetInfo.names[0])) {
                        return "assets/style/[name].[ext]";
                    }
                    if (/\.(woff2?|ttf|otf|eot)$/.test(assetInfo.names[0])) {
                        return "assets/fonts/[name][extname]";
                    }
                    return "[name].[ext]";
                },
            }
        },
    },
	plugins: [
		vituum({
            pages: {
                dir: "src/views",
                normalizeBasePath: true,
            },
        }),
        pug({
            root: "src",
            globals: {
                nav: nav,
                project: project,
                isProd: process.env.NODE_ENV === "production"
            },
            options: {
                pretty: true
            }
        })
	],
    server: {
        host: true,
        open: pkg.demo?.server?.open || "index.html",
    },
	css: {
        preprocessorOptions: {
            scss: {
                api: "modern"
            }
        }
    },
    logLevel: 'error'
});