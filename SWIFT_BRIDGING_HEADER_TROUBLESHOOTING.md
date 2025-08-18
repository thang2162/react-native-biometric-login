# Swift Bridging Header Troubleshooting Guide

## Overview
This guide helps resolve Swift bridging header issues when using `react-native-biometric-login` in projects with static frameworks or React Native 0.81.0+.

## Common Error Messages

### 1. "BiometricLogin-Swift.h file not found"
**Cause**: Swift bridging header not generated or not in search paths
**Solution**: Ensure dynamic frameworks are used and header search paths are correct

### 2. "Cannot find 'BiometricLoginImpl' in scope"
**Cause**: Swift file not properly included in module build
**Solution**: Check podspec configuration and ensure Swift files are included

### 3. "Swift module 'BiometricLogin' not found"
**Cause**: Module not properly configured for Swift
**Solution**: Verify `DEFINES_MODULE = 'YES'` and Swift version settings

## Quick Fixes

### Fix 1: Use Dynamic Frameworks (Recommended)
Update your `ios/Podfile`:

```ruby
# Use dynamic frameworks by default for Swift bridging header compatibility
use_frameworks! :linkage => :dynamic

# Firebase configuration - Firebase will handle its own static linkage internally
$RNFirebaseAsStaticFramework = true
```

### Fix 2: Selective Dynamic Configuration
If you must keep static frameworks, configure only BiometricLogin to be dynamic:

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

## Step-by-Step Resolution

### Step 1: Clean Installation
```bash
cd ios
rm -rf Pods Podfile.lock build
pod install
```

### Step 2: Verify Podfile Configuration
Ensure your Podfile has the correct framework linkage settings.

### Step 3: Check Xcode Build Settings
1. Open your project in Xcode
2. Select the BiometricLogin target
3. Verify these build settings:
   - `DEFINES_MODULE` = `YES`
   - `SWIFT_INSTALL_OBJC_HEADER` = `YES`
   - `SWIFT_VERSION` = `5.0`

### Step 4: Verify Swift Bridging Header Generation
Check if the Swift bridging header is generated:
```bash
find ~/Library/Developer/Xcode/DerivedData -name "*BiometricLogin-Swift.h*"
```

## Firebase Compatibility

### Problem
Firebase projects often require static frameworks, which conflict with Swift bridging headers.

### Solution
Use `$RNFirebaseAsStaticFramework = true` to let Firebase handle its own static linkage while keeping other frameworks dynamic.

```ruby
# Use dynamic frameworks by default
use_frameworks! :linkage => :dynamic

# Firebase will handle its own static linkage
$RNFirebaseAsStaticFramework = true
```

## Verification Steps

### 1. Check Build Success
```bash
xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug build
```

### 2. Verify Swift Bridging Header
The header should be generated in:
```
~/Library/Developer/Xcode/DerivedData/YourApp-*/Build/Products/Debug-iphonesimulator/BiometricLogin/BiometricLogin.framework/Headers/BiometricLogin-Swift.h
```

### 3. Test BiometricLogin Functionality
Ensure the library works as expected after configuration changes.

## Common Configuration Mistakes

### ❌ Don't Do This
```ruby
# This prevents Swift bridging headers from working
use_frameworks! :linkage => :static
```

### ✅ Do This Instead
```ruby
# This enables Swift bridging headers
use_frameworks! :linkage => :dynamic
```

## Environment Requirements

- **React Native**: 0.81.0+
- **iOS**: 12.0+
- **Xcode**: 15.0+
- **CocoaPods**: Latest version

## Still Having Issues?

1. **Check the main README.md** for complete installation instructions
2. **Verify your React Native version** is 0.81.0+
3. **Ensure Xcode 15+** is installed
4. **Clean and rebuild** your project completely
5. **Check for conflicting pods** that might force static frameworks

## Related Documentation

- [Main README.md](./README.md) - Complete installation guide
- [BIOMETRIC_LOGIN_SWIFT_FIXES.md](./BIOMETRIC_LOGIN_SWIFT_FIXES.md) - Technical details of fixes
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting guide
