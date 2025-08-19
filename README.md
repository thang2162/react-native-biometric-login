# react-native-biometric-login

A React Native module that enables biometric authentication and securely stores user credentials using native APIs. This library provides a comprehensive solution for implementing biometric login functionality in React Native applications with support for both iOS and Android platforms.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [iOS Setup](#ios-setup)
- [Swift Bridging Header Compatibility](#swift-bridging-header-compatibility)
- [Android Setup](#android-setup)
- [API Reference](#api-reference)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Features

- 🔐 **Biometric Authentication**: Support for Touch ID, Face ID, and Android biometric sensors
- 💾 **Secure Credential Storage**: Encrypted storage of username and password using native keychain/keystore
- 🚀 **Turbo Module**: Built with React Native's new architecture for optimal performance
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🔒 **Security-First**: Uses platform-native security mechanisms
- 📦 **TypeScript Support**: Full TypeScript definitions included

## Installation

### Using Yarn (Recommended)

```sh
yarn add react-native-biometric-login
```

### Using npm

```sh
npm install react-native-biometric-login
```

### 🔄 Upgrading from Older Versions?

If you're upgrading from a version before 2.0.22, see the [Migration Guide](./MIGRATION_GUIDE.md) for important changes related to Swift bridging headers and React Native 0.81.0+ compatibility.

### ⚠️ Important: Codegen Configuration

This library uses React Native's new architecture and requires proper codegen configuration in your consuming app. If you encounter build errors related to missing generated sources, please see the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.

**Quick fix**: Ensure your consuming app has `codegenEnabled = true` in the React configuration.

**💡 Pro tip**: Run `yarn check-setup` (if you're in this repo) or use the setup check script to verify your configuration. For consuming apps, you can also run `npx react-native-biometric-login verify-setup` to check your setup.

**📖 For detailed integration instructions and troubleshooting, see [INTEGRATION.md](./INTEGRATION.md)**

**🚨 Having build issues when installing via npm? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for comprehensive solutions!**

### iOS Setup

For iOS, you'll need to:

1. Install the pods:
```sh
cd ios && pod install
```

2. Add the following usage description to your `Info.plist` file:
```xml
<key>NSFaceIDUsageDescription</key>
<string>This app uses Face ID to securely authenticate and store your login credentials.</string>
```

**Note**: The `NSFaceIDUsageDescription` key is required for both Face ID and Touch ID authentication. Even if your app only uses Touch ID, you must include this key with a meaningful description of why your app needs biometric authentication.

**💡 Pro tip**: If you're building the example app and encounter Ruby/bundler issues, you may need to run `bundle install` first to install the required Ruby gems for CocoaPods.

### ⚠️ Swift Bridging Header Compatibility

This library contains Swift code that requires proper framework linkage configuration. If you encounter build errors related to missing `BiometricLogin-Swift.h` files, you need to configure your project to use dynamic frameworks.

#### For Projects Using Static Frameworks (e.g., with Firebase)

**Option 1: Use Dynamic Frameworks (Recommended)**
Update your `ios/Podfile`:

```ruby
# Use dynamic frameworks by default for Swift bridging header compatibility
use_frameworks! :linkage => :dynamic

# Firebase configuration - Firebase will handle its own static linkage internally
$RNFirebaseAsStaticFramework = true
```

**Option 2: Selective Dynamic Frameworks**
If you need to keep static frameworks for other reasons, you can configure only BiometricLogin to use dynamic linkage:

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

**Option 3: Complete Podfile Example**
Here's a complete Podfile example that demonstrates proper configuration for Swift bridging header compatibility in a project that implements both React Native Firebase and this biometric login package:

```ruby
# Resolve react_native_pods.rb with node to allow for hoisting
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

platform :ios, min_ios_version_supported
prepare_react_native_project!

# Specify the Xcode project to use
project 'bioTest.xcodeproj'

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

# Use dynamic frameworks by default for Swift bridging header compatibility
use_frameworks! :linkage => :dynamic

# Firebase configuration - Firebase will handle its own static linkage internally
$RNFirebaseAsStaticFramework = true

target 'bioTest' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  # Fix for Swift pod integration issue with FirebaseCoreInternal and GoogleUtilities
  pod 'GoogleUtilities', :modular_headers => true

  post_install do |installer|
    # Ensure Firebase modules are properly configured
    installer.pods_project.targets.each do |target|
      if target.name.include?('Firebase')
        target.build_configurations.each do |config|
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
          config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
        end
      end
    end
    # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      # :ccache_enabled => true
    )
  end
end
```

**Clean Installation Steps**
After making changes to the Podfile:

```bash
cd ios
rm -rf Pods Podfile.lock build
pod install
```

### Android Setup

For Android, ensure you have the following permissions in your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

## API Reference

### Methods

#### `BiometricIsAvailable(): Promise<boolean>`
Checks if biometric authentication is available on the device.

#### `BasicBiometricAuth(title: string, desc: string): Promise<boolean>`
Performs basic biometric authentication without retrieving stored credentials.

#### `LoginBiometricAuth(title: string, desc: string): Promise<User>`
Performs biometric authentication and returns stored user credentials if successful.

#### `SetUser(username: string, password: string): Promise<boolean>`
Securely stores user credentials using biometric authentication.

#### `UpdateUser(username: string, password: string): Promise<boolean>`
Updates existing user credentials using biometric authentication.

#### `GetUser(): Promise<User>`
Retrieves stored user credentials.

#### `DeleteUser(): Promise<boolean>`
Deletes stored user credentials.

### Types

```typescript
interface User {
  username: string;
  password: string;
}
```

## Usage

### Basic Example

```typescript
import { BiometricLogin } from 'react-native-biometric-login';
import type { User } from 'react-native-biometric-login';

// Check if biometric authentication is available
const checkAvailability = async () => {
  try {
    const isAvailable = await BiometricLogin.BiometricIsAvailable();
    console.log('Biometric available:', isAvailable);
  } catch (error) {
    console.error('Error checking availability:', error);
  }
};

// Store user credentials
const storeCredentials = async (username: string, password: string) => {
  try {
    const success = await BiometricLogin.SetUser(username, password);
    if (success) {
      console.log('Credentials stored successfully');
    }
  } catch (error) {
    console.error('Error storing credentials:', error);
  }
};

// Authenticate and retrieve credentials
const login = async () => {
  try {
    const user: User = await BiometricLogin.LoginBiometricAuth(
      'Login Required',
      'Please authenticate to access your account'
    );
    console.log('Login successful:', user.username);
    return user;
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Complete Example

See the [example app](./example/src/App.tsx) for a full implementation demonstrating all features.

## Troubleshooting

### Common Build Issues

#### iOS Build Issues

For iOS build issues, ensure you have:
- Xcode 15+ installed
- Proper pod installation: `cd ios && pod install`
- Correct deployment target (iOS 13.0+)

**Swift Bridging Header Issues**
If you encounter errors like `"BiometricLogin-Swift.h file not found"`:

1. **Check framework linkage**: Ensure your project uses dynamic frameworks
2. **Clean and reinstall pods**:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock build
   pod install
   ```
3. **Verify Podfile configuration**: See the [Swift Bridging Header Compatibility](#-swift-bridging-header-compatibility) section above

📖 **For detailed Swift bridging header troubleshooting, see [SWIFT_BRIDGING_HEADER_TROUBLESHOOTING.md](./SWIFT_BRIDGING_HEADER_TROUBLESHOOTING.md)**

#### Android Build Fails with "Unresolved reference 'NativeBiometricLoginSpec'"

This error occurs when the React Native codegen doesn't properly generate the required spec files. Here's how to fix it:

1. **Clean and rebuild**:
   ```sh
   cd android
   ./gradlew clean
   cd ..
   yarn android
   ```

2. **Ensure proper codegen setup** in your consuming app's `android/settings.gradle`:
   ```gradle
   apply from: file("../node_modules/@react-native/gradle-plugin/settings.gradle")
   ```

3. **Check your app's `android/build.gradle`** has the correct React Native version:
   ```gradle
   buildscript {
       ext {
           reactNativeVersion = "0.81.0" // Use the version compatible with this library
       }
   }
   ```

4. **Verify your app's `android/app/build.gradle`** includes:
   ```gradle
   apply from: file("../../node_modules/@react-native/gradle-plugin/libs/react.gradle")
   ```

5. **If the issue persists**, try adding this to your app's `android/app/build.gradle`:
   ```gradle
   android {
       // ... other config
       sourceSets {
           main {
               java.srcDirs += [
                   file("../../node_modules/react-native-biometric-login/android/build/generated/source/codegen/java")
               ]
           }
       }
   }
   ```

#### Other Common Errors

- **"Unresolved reference 'NativeBiometricLoginSpec'"** → Missing codegen, run the quick fix above
- **"Cannot specify link libraries for target 'react_codegen_BiometricLoginSpec'"** → CMake build failure, run the quick fix above
- **CMake build failures** → Usually codegen issues, run the quick fix above

### Getting Help

If you're still experiencing issues:
1. Check the [example app](./example/src/App.tsx) for working implementation
2. Ensure your React Native version is compatible (0.81.0+)
3. Open an issue with your error logs and environment details

## Development

### Prerequisites

- Node.js 18+
- Yarn 3.6.1+
- React Native 0.81.0+ (required for Swift bridging header compatibility)
- Xcode 15+ (for iOS development)
- Android Studio (for Android development)

**Note**: This library requires React Native 0.81.0+ due to Swift bridging header requirements and TurboModule architecture changes.

### Setup

1. Clone the repository:
```sh
git clone https://github.com/thang2162/react-native-biometric-login.git
cd react-native-biometric-login
```

2. Install dependencies:
```sh
yarn install
```

3. Build the library:
```sh
yarn prepare
```

### Available Scripts

- `yarn example` - Run the example app
- `yarn test` - Run tests
- `yarn typecheck` - TypeScript type checking
- `yarn lint` - ESLint code linting
- `yarn clean` - Clean build artifacts
- `yarn prepare` - Build the library
- `yarn release` - Release a new version

### Running the Example

```sh
# Start the example app
yarn example

# For iOS
cd example/ios && pod install
cd .. && yarn ios

# For Android
yarn android
```

**💡 iOS Build Note**: If you encounter Ruby/bundler issues when building the iOS example, run `bundle install` first to install the required Ruby gems for CocoaPods.

## Architecture

This library is built using:
- **React Native Builder Bob** for library building and configuration
- **Turbo Modules** for native module implementation
- **Kotlin** for Android implementation
- **Swift** for iOS implementation
- **TypeScript** for type definitions

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Development workflow
- Code style and standards
- Testing requirements
- Pull request process

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
