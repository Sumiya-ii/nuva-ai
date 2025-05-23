import 'dotenv/config'; 

export default {
  name: 'NuvaAI',
  slug: 'nuva-ai',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.nuvaai.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.nuvaai.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    openaiApiKey: process.env.OPENAI_API_KEY
  },
  plugins: [
    [
      'expo-av',
      {
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.'
      }
    ]
  ]
};
