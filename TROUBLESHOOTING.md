# Troubleshooting Guide

## Common Issues and Solutions

### Android Build Errors - Missing Codegen Sources

If you encounter build errors like:
```
error: cannot find symbol class NativeBiometricLoginSpec
error: package com.biometriclogin does not exist
```

This typically means the autolinking system cannot find the generated codegen sources. The library outputs generated sources to `android/build/generated/source/codegen/` but autolinking may be looking in different locations. Here are the solutions:

#### Solution 1: Clean and Rebuild (Recommended)
```bash
# In your consuming app
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### Solution 2: Check React Native Gradle Plugin Configuration
Ensure your consuming app has the React Native Gradle Plugin properly configured in `android/settings.gradle`:

```gradle
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_PROJECT)
    repositories {
        google()
        mavenCentral()
    }
}

include ':app'
include ':react-native-gradle-plugin'
project(':react-native-gradle-plugin').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native/gradle-plugin')
```

#### Solution 3: Verify Codegen is Enabled
In your consuming app's `android/gradle.properties`, ensure:
```properties
newArchEnabled=true
codegenEnabled=true
```

#### Solution 4: Check Metro Configuration
If using Metro bundler, ensure your `metro.config.js` includes:
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

#### Solution 5: Reinstall the Library
```bash
# Remove and reinstall the library
npm uninstall react-native-biometric-login
npm install react-native-biometric-login

# For iOS, also reinstall pods
cd ios && pod install && cd ..
```

#### Solution 6: Manual Codegen (Last Resort)
If all else fails, you can manually run codegen in your consuming app:
```bash
npx react-native codegen
```

#### Solution 7: Check Autolinking Paths
The library generates sources to `android/build/generated/source/codegen/`. If autolinking is looking elsewhere, you may need to:

1. **Clean the library's build directory** and regenerate:
   ```bash
   # In the library directory
   yarn clean
   yarn codegen
   yarn prepare
   ```

2. **Verify the consuming app's autolinking configuration** in `android/settings.gradle`:
   ```gradle
   include ':react-native-gradle-plugin'
   project(':react-native-gradle-plugin').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native/gradle-plugin')
   ```

### iOS Build Errors

#### Solution 1: Pod Install
```bash
cd ios
pod install
cd ..
```

**💡 Note**: If you encounter Ruby/bundler issues when running `pod install`, run `bundle install` first:
```bash
bundle install
cd ios
pod install
cd ..
```

#### Solution 2: Clean Build
```bash
cd ios
xcodebuild clean
cd ..
npx react-native run-ios
```

### General Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache
```

#### Build Cache Issues
```bash
# Clear all build caches
npx react-native clean
```

## Still Having Issues?

If you continue to experience problems:

1. Check the [GitHub Issues](https://github.com/thang2162/react-native-biometric-login/issues) for similar problems
2. Ensure you're using compatible versions of React Native (0.71+)
3. Verify your development environment matches the [React Native requirements](https://reactnative.dev/docs/environment-setup)
4. Create a new issue with:
   - React Native version
   - Platform (iOS/Android)
   - Full error message
   - Steps to reproduce
   - Environment details

### 1. Codegen Issues When Installing as a Library

If you encounter build errors related to missing generated sources when installing this library in another project, follow these steps:

#### Problem
The error typically looks like:
```
CMake Error: No source files found for react_codegen_BiometricLoginSpec
```

#### Root Cause
This happens because the CMake configuration is looking for generated sources in the wrong location when the library is installed as a dependency.

#### Solution

**Step 1: Ensure React Native Gradle Plugin is properly configured**

In your consuming app's `android/build.gradle`, make sure you have:

```gradle
buildscript {
  dependencies {
    classpath "com.facebook.react:react-native-gradle-plugin"
  }
}
```

**Step 2: Enable codegen in your consuming app**

In your consuming app's `android/app/build.gradle`, add:

```gradle
apply plugin: "com.facebook.react"

react {
  // Enable new architecture
  newArchEnabled = true
  // Enable codegen
  codegenEnabled = true
}
```

**Step 3: Configure codegen in your consuming app**

In your consuming app's `package.json`, add:

```json
{
  "codegenConfig": {
    "libraries": [
      {
        "name": "BiometricLoginSpec",
        "type": "modules",
        "jsSrcsDir": "node_modules/react-native-biometric-login/src",
        "android": {
          "javaPackageName": "com.biometriclogin"
        }
      }
    ]
  }
}
```

**Step 4: Clean and rebuild**

```bash
cd android
./gradlew clean
cd ..
yarn android
```

### 2. CMake Path Issues

#### Problem
CMake cannot find the generated sources because they're in the wrong location.

#### Solution
The library now includes a more robust CMakeLists.txt that looks for sources in multiple locations. If you still have issues, manually specify the generated sources path in your consuming app's `android/app/build.gradle`:

```gradle
android {
  // ... other config
  
  sourceSets {
    main {
      jniLibs.srcDirs += [
        "build/generated/source/codegen/jni"
      ]
    }
  }
}
```

### 3. Missing Dependencies

#### Problem
Build fails with missing native dependencies.

#### Solution
Ensure your consuming app has the required dependencies in `android/app/build.gradle`:

```gradle
dependencies {
  // ... other dependencies
  
  // Biometric authentication
  implementation "androidx.biometric:biometric:1.1.0"
  
  // Security for encryption
  implementation "androidx.security:security-crypto:1.1.0-alpha06"
  
  // For JSON parsing
  implementation "com.google.code.gson:gson:2.10.1"
}
```

### 4. React Native Version Compatibility

#### Problem
Library doesn't work with your React Native version.

#### Solution
This library is compatible with React Native 0.71+. For older versions, you may need to use an older version of this library or upgrade React Native.

### 5. Metro Configuration Issues

#### Problem
Metro cannot resolve the library modules.

#### Solution
Ensure your `metro.config.js` includes the library:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'node_modules/react-native-biometric-login/node_modules')
    ]
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## Debugging Steps

1. **Check the build output** for specific error messages
2. **Verify codegen is enabled** in your consuming app
3. **Clean all build artifacts** and rebuild
4. **Check file paths** in the generated CMake files
5. **Verify React Native version compatibility**

## Getting Help

If you continue to experience issues:

1. Check the [GitHub Issues](https://github.com/thang2162/react-native-biometric-login/issues)
2. Ensure you're using a compatible React Native version
3. Verify your consuming app's configuration matches the examples above
4. Try the example app in this repository to verify the library works

## Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| `No source files found for react_codegen_BiometricLoginSpec` | Enable codegen in consuming app, clean and rebuild |
| `CMake Error: No such file or directory` | Check generated sources path, ensure codegen ran |
| `Cannot resolve symbol` | Verify native dependencies are included |
| `Metro cannot resolve module` | Check metro configuration and node_modules |
