const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite web loads wa-sqlite.wasm as a Metro asset
config.resolver.assetExts.push('wasm');

module.exports = config;
