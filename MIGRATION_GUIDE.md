# Migration Guide - React Native Biometric Login

## Overview
This guide helps users migrate from older versions of `react-native-biometric-login` to version 2.0.22+ which includes Swift bridging header fixes and React Native 0.81.0+ compatibility.

## Breaking Changes

### React Native Version Requirement
- **Before**: Compatible with React Native 0.70.0+
- **After**: Requires React Native 0.81.0+

### iOS Framework Requirements
- **Before**: Worked with both static and dynamic frameworks
- **After**: Requires dynamic frameworks for Swift bridging header compatibility

## Migration Steps

### Step 1: Update React Native Version
Ensure your project uses React Native 0.81.0+:

```bash
# Check current version
npx react-native --version

# Update if needed (follow React Native upgrade guide)
npx react-native upgrade
```

### Step 2: Update Library Version
```bash
# Using yarn (recommended)
yarn add react-native-biometric-login@latest

# Using npm
npm install react-native-biometric-login@latest
```

### Step 3: Update iOS Configuration

#### Option A: Use Dynamic Frameworks (Recommended)
Update your `ios/Podfile`:

```ruby
# BEFORE (Old configuration)
use_frameworks! :linkage => :static

# AFTER (New configuration)
use_frameworks! :linkage => :dynamic
```

#### Option B: Keep Static Frameworks with Selective Dynamic
If you must keep static frameworks:

```ruby
# Keep static frameworks by default
use_frameworks! :linkage => :static

# Add post-install hook to make BiometricLogin dynamic
post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == 'BiometricLogin'
      target.build_configurations.each do |config|
        config.build_settings['MACH_O_TYPE'] = 'mh_dylib'
        config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
        config.build_settings['DEFINES_MODULE'] = 'YES'
        config.build_settings['SWIFT_INSTALL_OBJC_HEADER'] = 'YES'
      end
    end
  end
end
```

### Step 4: Clean and Reinstall
```bash
cd ios
rm -rf Pods Podfile.lock build
pod install
```

### Step 5: Update Android Configuration
Ensure your Android project has the React Native Gradle Plugin:

```gradle
// android/settings.gradle
apply from: file("../node_modules/@react-native/gradle-plugin/settings.gradle")
```

```gradle
// android/app/build.gradle
apply from: file("../../node_modules/@react-native/gradle-plugin/libs/react.gradle")
```

## Firebase Projects

### Before Migration
Firebase projects typically used:
```ruby
use_frameworks! :linkage => :static
$RNFirebaseAsStaticFramework = true
```

### After Migration
Update to:
```ruby
use_frameworks! :linkage => :dynamic
$RNFirebaseAsStaticFramework = true
```

Firebase will handle its own static linkage internally while allowing other frameworks to be dynamic.

## Common Migration Issues

### Issue 1: "BiometricLogin-Swift.h file not found"
**Cause**: Still using static frameworks
**Solution**: Switch to dynamic frameworks as shown above

### Issue 2: Build fails with React Native 0.81.0+
**Cause**: Missing React Native Gradle Plugin
**Solution**: Add the plugin configuration shown in Step 5

### Issue 3: Firebase compatibility issues
**Cause**: Framework linkage conflicts
**Solution**: Use the Firebase configuration shown above

## Verification

### iOS
1. Clean build: `cd ios && xcodebuild clean`
2. Install pods: `pod install`
3. Build project in Xcode

### Android
1. Clean build: `cd android && ./gradlew clean`
2. Rebuild: `./gradlew assembleDebug`

## Rollback Plan

If migration causes issues, you can temporarily rollback:

```bash
# Install previous version
yarn add react-native-biometric-login@2.0.21

# Revert Podfile changes
# Revert Android configuration changes
```

**Note**: Rolling back will lose the Swift bridging header fixes and React Native 0.81.0+ compatibility.

## Support

If you encounter migration issues:

1. Check the [Swift Bridging Header Troubleshooting Guide](./SWIFT_BRIDGING_HEADER_TROUBLESHOOTING.md)
2. Review the [Main Troubleshooting Guide](./TROUBLESHOOTING.md)
3. Open an issue with your error logs and environment details

## What's New in 2.0.22+

- ✅ Swift bridging header compatibility fixes
- ✅ React Native 0.81.0+ support
- ✅ Improved Firebase compatibility
- ✅ Better error handling and debugging
- ✅ Enhanced TypeScript definitions
- ✅ TurboModule architecture improvements

## Timeline

- **Immediate**: Update library and iOS configuration
- **Short-term**: Test thoroughly in development
- **Long-term**: Plan for React Native 0.81.0+ upgrade if not already done
