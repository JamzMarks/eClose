// @ts-check
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes("html")) {
  config.resolver.assetExts.push("html");
}

module.exports = config;
