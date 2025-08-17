# react-native-biometric-login

A React Native module that enables biometric authentication and securely stores user credentials using native APIs. This library provides a comprehensive solution for implementing biometric login functionality in React Native applications with support for both iOS and Android platforms.

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

**📖 For detailed integration instructions and troubleshooting, see [INTEGRATION.md](./INTEGRATION.md)**

**🚨 Having build issues when installing via npm? Check [QUICK_FIX.md](./QUICK_FIX.md) for the 3-step solution!**

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

#### iOS Build Issues

For iOS build issues, ensure you have:
- Xcode 15+ installed
- Proper pod installation: `cd ios && pod install`
- Correct deployment target (iOS 13.0+)

### Common Issues & Quick Fixes

#### 🚨 "Library works in example but fails when installed via npm"

This is the most common issue with TurboModules. **Quick fix in 3 steps:**

1. **Add React Native Gradle Plugin** to your `android/build.gradle`
2. **Enable autolinking** in your `android/app/build.gradle`
3. **Force codegen regeneration** with `./gradlew generateCodegenArtifactsFromSchema`

📖 **See [QUICK_FIX.md](./QUICK_FIX.md) for the complete solution**

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
- React Native 0.81.0+
- Xcode 15+ (for iOS development)
- Android Studio (for Android development)

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
