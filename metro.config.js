// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolver o problema do SHA-1 com pnpm global
config.resolver.blockList = [
  /.*\/Library\/pnpm\/global\/.*/,
  /.*\/\.pnpm\/.*/,
];

// Garantir que apenas dependências locais sejam usadas
config.watchFolders = [__dirname];

// Forçar uso apenas de dependências locais
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configurar resolver para ignorar pnpm global
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
