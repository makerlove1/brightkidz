module.exports = {
  publicPath: "",
  runtimeCompiler: true,
  transpileDependencies: [],
  
  // Force cache busting in development
  configureWebpack: {
    output: {
      filename: process.env.NODE_ENV === 'development' 
        ? '[name].[hash].js' 
        : '[name].[contenthash].js'
    }
  },
  
  pwa: {
    name: 'BrightKidz',
    shortName: 'BrightKidz',
    themeColor: '#667eea',
    msTileColor: '#667eea',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    
    // Manifest options
    manifestOptions: {
      name: 'BrightKidz - Educational Games for Kids',
      short_name: 'BrightKidz',
      description: 'Fun educational games for children to learn letters, numbers, and words in multiple languages',
      theme_color: '#667eea',
      background_color: '#1a1a2e',
      display: 'standalone',
      orientation: 'any',
      start_url: '.',
      scope: '.',
      icons: [
        {
          src: './img/logo.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        }
      ],
      categories: ['education', 'games', 'kids'],
      lang: 'en-US',
      dir: 'ltr'
    },
    
    // Workbox options for offline support
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      
      // Cache all assets
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              maxEntries: 30,
            },
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          }
        },
        {
          urlPattern: /\.(?:mp3|wav|ogg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'audio',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
          }
        }
      ],
      
      // Exclude patterns
      exclude: [/\.map$/, /^manifest.*\.js$/]
    }
  }
};
