const { getDefaultConfig } = require('expo/metro-config')
const { getSentryExpoConfig } = require('@sentry/react-native/metro')

const defaultConfig = getDefaultConfig(__dirname)
const sentryConfig = getSentryExpoConfig(__dirname)

const config = {
  ...defaultConfig,
  ...sentryConfig,
}

// Keep SVG transformer configuration
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
}

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
}

module.exports = config
