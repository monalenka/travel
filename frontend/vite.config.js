import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                tours: resolve(__dirname, 'tours.html'),
                tour: resolve(__dirname, 'tour.html')
            }
        },
        // Копируем assets в билд
        assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg']
    },
    // Публичная папка
    publicDir: 'assets'
})