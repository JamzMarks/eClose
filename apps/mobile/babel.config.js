module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@app": "./app",
            "@components": "./src/components",
            "@ui": "./src/components/ui",
            "@features": "./src/features",
            "@lib": "./src/lib",
            "@services": "./src/services",
            "@contexts": "./src/contexts",
            "@utils": "./src/utils",
            "@types": "./src/types",
            "@contracts": "./src/contracts",
          },
        },
      ],
    ],
  };
};

