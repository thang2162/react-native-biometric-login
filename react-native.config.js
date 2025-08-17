module.exports = {
  dependencies: {
    'react-native-biometric-login': {
      platforms: {
        android: {
          sourceDir: './android',
        },
        ios: {
          podspecPath: './BiometricLogin.podspec',
        },
      },
    },
  },
};
