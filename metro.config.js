// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle metro-cache issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
