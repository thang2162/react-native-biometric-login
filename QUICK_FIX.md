# Quick Fix for npm Installation Issues

If you're getting build errors when installing `react-native-biometric-login` via npm, here's the quick fix:

## The Problem
The library works in the example app but fails when installed as a dependency. This is a common TurboModule issue.

## Quick Fix (3 steps)

### 1. Add React Native Gradle Plugin
In your consuming app's `android/build.gradle`:
```gradle
buildscript {
  dependencies {
    classpath("com.facebook.react:react-native-gradle-plugin")
  }
}
```

### 2. Enable Autolinking
In your consuming app's `android/app/build.gradle`:
```gradle
apply from: file("../../node_modules/@react-native/gradle-plugin/libs/react.gradle")

react {
  autolinkLibrariesWithApp()
}
```

### 3. Force Codegen Regeneration
```bash
cd android
./gradlew clean
./gradlew generateCodegenArtifactsFromSchema
cd ..
yarn android
```

## That's it! 

If you still have issues, check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for detailed solutions.

## Common Error Messages
- ❌ "Unresolved reference 'NativeBiometricLoginSpec'"
- ❌ "Cannot specify link libraries for target 'react_codegen_BiometricLoginSpec'"
- ❌ CMake build failures

All of these are fixed by the steps above.
