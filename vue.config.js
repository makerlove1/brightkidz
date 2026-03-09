module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  transpileDependencies: [],
  
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },
  
  pwa: {
    name: 'BrightKidz',
    shortName: 'BrightKidz',
    themeColor: '#667eea',
    msTileColor: '#667eea',
    
    manifestOptions: {
      name: 'BrightKidz - Educational Games for Kids',
      short_name: 'BrightKidz',
      description: 'Fun educational games for children',
      theme_color: '#667eea',
      background_color: '#1a1a2e',
      display: 'standalone',
      start_url: './',
      icons: [
        {
          src: './img/logo.svg',
          sizes: '512x512',
          type: 'image/svg+xml'
        }
      ]
    },
    
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
};
