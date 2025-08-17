# Integration Guide for react-native-biometric-login

This guide explains how to properly integrate `react-native-biometric-login` into your React Native app and resolve common build issues.

## Prerequisites

- React Native 0.81.0 or higher
- Android API level 24+ (Android 7.0+)
- iOS 13.0+

## Installation

```bash
yarn add react-native-biometric-login
# or
npm install react-native-biometric-login
```

## Android Integration

### 1. Automatic Linking (Recommended for TurboModules)

The library should automatically link. If you encounter issues, ensure your `android/settings.gradle` includes:

```gradle
apply from: file("../node_modules/@react-native/gradle-plugin/settings.gradle")
```

### 2. Manual Linking (if needed)

Add to your `android/app/src/main/java/com/yourapp/MainApplication.java`:

```java
import com.biometriclogin.BiometricLoginPackage;

// In getPackages() method:
@Override
protected List<ReactPackage> getPackages() {
  List<ReactPackage> packages = new PackageList(this).getPackages();
  packages.add(new BiometricLoginPackage());
  return packages;
}
```

### 3. Fixing TurboModule Codegen Issues

If you encounter the error `Unresolved reference 'NativeBiometricLoginSpec'` when installing via npm, follow these steps:

#### Step 1: Verify React Native Gradle Plugin
Ensure your `android/build.gradle` includes:
```gradle
buildscript {
  dependencies {
    classpath("com.facebook.react:react-native-gradle-plugin")
  }
}
```

#### Step 2: Check App Build Configuration
Your `android/app/build.gradle` should include:
```gradle
apply from: file("../../node_modules/@react-native/gradle-plugin/libs/react.gradle")
```

#### Step 3: Force Codegen Regeneration
```bash
cd android
./gradlew clean
./gradlew generateCodegenArtifactsFromSchema
cd ..
yarn android
```

#### Step 4: Alternative - Add to MainApplication.kt
If autolinking still fails, manually add the package to your `MainApplication.kt`:

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

#### Step 5: Check React Native Config
Ensure your consuming app has a `react-native.config.js` that doesn't interfere with the library:

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

### 4. Common Build Errors and Solutions

#### Error: "Cannot specify link libraries for target 'react_codegen_BiometricLoginSpec'"
**Solution**: This usually means the codegen isn't properly configured. Run:
```bash
cd android
./gradlew clean
./gradlew generateCodegenArtifactsFromSchema
cd ..
```

#### Error: "Unresolved reference 'NativeBiometricLoginSpec'"
**Solution**: The codegen files aren't being generated. Check:
1. React Native Gradle Plugin is properly configured
2. The library is properly autolinked
3. Run the codegen regeneration steps above

#### Error: CMake build failures
**Solution**: This indicates the native codegen isn't working. Ensure:
1. Your app has the correct React Native version (0.81.0+)
2. The React Native Gradle Plugin is properly configured
3. Autolinking is enabled with `autolinkLibrariesWithApp()`

## iOS Integration

### 1. Automatic Linking
The library should automatically link via CocoaPods.

### 2. Manual Linking (if needed)
Add to your `ios/Podfile`:
```ruby
pod 'BiometricLogin', :path => '../node_modules/react-native-biometric-login'
```

### 3. Fixing iOS Build Issues
If you encounter build issues on iOS:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## Troubleshooting

### Library Works in Example but Fails in Consuming App
This is a common issue with TurboModules. The problem is usually:

1. **Missing React Native Gradle Plugin**: Ensure your consuming app has the correct plugin configuration
2. **Codegen not running**: The consuming app needs to run codegen to generate the native spec files
3. **Autolinking conflicts**: Check if there are conflicting configurations in `react-native.config.js`

### Version Compatibility
- **React Native 0.81.0+**: Fully supported with TurboModules
- **React Native 0.80.x**: May work but not officially supported
- **React Native < 0.80**: Not supported, use legacy bridge version

### Build Environment
- **Android Studio**: Use the latest version with proper NDK setup
- **Xcode**: Use Xcode 15+ for iOS builds
- **Node.js**: Use Node.js 18+ as specified in package.json

## Getting Help

If you continue to experience issues:

1. Check the [GitHub Issues](https://github.com/thang2162/react-native-biometric-login/issues)
2. Ensure you're using the latest version of the library
3. Verify your React Native version compatibility
4. Check that your build environment meets the prerequisites

## Example Working Configuration

Here's a minimal working configuration for a consuming app:

**android/settings.gradle**:
```gradle
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

This configuration should allow the TurboModule to work properly when installed via npm.
