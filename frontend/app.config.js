import 'dotenv/config';

export default {
  expo: {
    name: 'todo',
    slug: 'todo',
    version: '1.0.0',
    orientation: 'portrait',
    entryPoint: '/src/App.tsx',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      GRAPHQL_URL: process.env.GRAPHQL_URL,
      API_URL: process.env.API_URL,
    },
  },
};
