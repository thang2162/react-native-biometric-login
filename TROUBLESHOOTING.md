# Troubleshooting Guide for npm Installation Issues

This guide specifically addresses issues that occur when installing `react-native-biometric-login` via npm in consuming apps.

## Common Issue: Library Works in Example but Fails in Consuming App

This is the most common issue with TurboModules when published to npm. The library works fine in the example app (local development) but fails to build when installed as a dependency.

### Root Cause
The issue occurs because:
1. **Codegen not running**: The consuming app needs to run React Native's codegen to generate the native spec files
2. **Missing React Native Gradle Plugin**: The consuming app must have the proper plugin configuration
3. **Autolinking conflicts**: Incorrect `react-native.config.js` configuration can interfere with the library

### Solution Steps

#### Step 1: Verify React Native Gradle Plugin
Ensure your consuming app's `android/build.gradle` includes:

```gradle
buildscript {
  dependencies {
    classpath("com.facebook.react:react-native-gradle-plugin")
  }
}
```

#### Step 2: Check App Build Configuration
Your `android/app/build.gradle` must include:

```gradle
apply from: file("../../node_modules/@react-native/gradle-plugin/libs/react.gradle")

android {
  // ... your config
}

react {
  autolinkLibrariesWithApp()
}
```

#### Step 3: Verify Settings.gradle
Your `android/settings.gradle` must include:

```gradle
apply from: file("../node_modules/@react-native/gradle-plugin/settings.gradle")
```

#### Step 4: Force Codegen Regeneration
Run these commands in your consuming app:

```bash
cd android
./gradlew clean
./gradlew generateCodegenArtifactsFromSchema
cd ..
yarn android
```

#### Step 5: Check React Native Config
Ensure your consuming app has a `react-native.config.js` that doesn't interfere:

```javascript
module.exports = {
  dependencies: {
    // Don't override the library's configuration
    'react-native-biometric-login': {
      platforms: {
        android: {},
        ios: {},
      },
    },
  },
};
```

## Specific Error Messages and Solutions

### Error: "Unresolved reference 'NativeBiometricLoginSpec'"
**Cause**: The codegen files aren't being generated in the consuming app.

**Solution**:
1. Ensure React Native Gradle Plugin is properly configured
2. Run codegen regeneration: `./gradlew generateCodegenArtifactsFromSchema`
3. Check that autolinking is enabled: `autolinkLibrariesWithApp()`

### Error: "Cannot specify link libraries for target 'react_codegen_BiometricLoginSpec'"
**Cause**: CMake build system can't find the generated codegen files.

**Solution**:
1. Clean build: `./gradlew clean`
2. Regenerate codegen: `./gradlew generateCodegenArtifactsFromSchema`
3. Ensure proper React Native version (0.81.0+)

### Error: "BiometricLoginPackage cannot be cast to NativeModule"
**Cause**: Incorrect package registration or missing dependencies.

**Solution**:
1. Use autolinking instead of manual linking
2. Ensure the library is properly autolinked
3. Check that all React Native dependencies are correct

### Error: CMake build failures
**Cause**: Native codegen isn't working properly.

**Solution**:
1. Verify React Native version compatibility (0.81.0+)
2. Ensure React Native Gradle Plugin is configured
3. Check that autolinking is enabled
4. Run codegen regeneration steps

## Alternative Solutions

### Option 1: Manual Package Registration
If autolinking continues to fail, manually add the package to your `MainApplication.kt`:

```kotlin
import com.biometriclogin.BiometricLoginPackage

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Add the package manually if autolinking fails
              add(BiometricLoginPackage())
            }
        // ... rest of your configuration
      }
}
```

### Option 2: Check Library Version
Ensure you're using the latest version of the library:

```bash
yarn add react-native-biometric-login@latest
# or
npm install react-native-biometric-login@latest
```

### Option 3: Verify Dependencies
Check that your consuming app has the correct peer dependencies:

```json
{
  "dependencies": {
    "react": "19.1.0",
    "react-native": "0.81.0"
  }
}
```

## Prevention

To prevent these issues in the future:

1. **Always use autolinking** for TurboModules
2. **Don't override library configurations** in `react-native.config.js`
3. **Keep React Native updated** to the latest stable version
4. **Use the recommended build configuration** from the integration guide

## Getting Help

If you continue to experience issues:

1. Check the [GitHub Issues](https://github.com/thang2162/react-native-biometric-login/issues)
2. Ensure you're using the latest version of the library
3. Verify your React Native version compatibility
4. Check that your build environment meets the prerequisites
5. Compare your configuration with the working example in the repository

## Working Configuration Example

Here's a complete working configuration for a consuming app:

**android/settings.gradle**:
```gradle
rootProject.name = 'YourAppName'
apply from: file("../node_modules/@react-native/gradle-plugin/settings.gradle")
```

**android/build.gradle**:
```gradle
buildscript {
  dependencies {
    classpath("com.facebook.react:react-native-gradle-plugin")
  }
}
```

**android/app/build.gradle**:
```gradle
apply from: file("../../node_modules/@react-native/gradle-plugin/libs/react.gradle")

android {
  // ... your config
}

react {
  autolinkLibrariesWithApp()
}
```

**react-native.config.js**:
```javascript
module.exports = {
  dependencies: {
    'react-native-biometric-login': {
      platforms: {
        android: {},
        ios: {},
      },
    },
  },
};
```

This configuration should allow the TurboModule to work properly when installed via npm.
