import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({mode}) => ({

  plugins: [
    react(),
    visualizer({
      open: false, // 빌드 후 브라우저로 자동 분석 페이지 오픈
      filename: 'dist/stats.html', // 결과 파일 저장 위치
      template: 'treemap' // 'sunburst', 'network' 도 가능
    })
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@css': path.resolve(__dirname, 'src/shared/styles'),
      '@utils': path.resolve(__dirname, 'src/shared/utils'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
    },
  },
  define: {
    // 환경변수 직접 바인딩도 가능 (예: legacy 지원 시)
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    minify: 'esbuild', // 기본 압축 (빠르고 효과 좋음)
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          // mui: ['@mui/material', '@mui/icons-material'],
          // wijmo: [
          //   '@grapecity/wijmo',
          //   '@grapecity/wijmo.input',
          //   '@grapecity/wijmo.react.input',
          //   '@grapecity/wijmo.grid',
          //   '@grapecity/wijmo.react.grid',
          //   '@grapecity/wijmo.grid.xlsx',
          //   '@grapecity/wijmo.react.nav'
          // ],
          vendors: ['axios', 'date-fns', 'sweetalert2']
        }
      }
    }
  },

}));
