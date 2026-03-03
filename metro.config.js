const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    port: 8081,
    host: "192.168.1.185",
  },
  watchFolders: [],
  resolver: {
    nodeModulesPath: require("path").resolve(__dirname, "node_modules"),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
