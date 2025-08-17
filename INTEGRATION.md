# Integration Guide

This guide explains how to properly integrate `react-native-biometric-login` into your React Native app.

## Prerequisites

- React Native 0.71.0 or higher
- Android API level 23+ (Android 6.0+)
- iOS 11.0+

## Installation

### 1. Install the library

```bash
yarn add react-native-biometric-login
# or
npm install react-native-biometric-login
```

### 2. Install iOS dependencies

```bash
cd ios
pod install
cd ..
```

## Android Configuration

### 1. Update android/build.gradle

Ensure you have the React Native Gradle Plugin:

```gradle
buildscript {
  dependencies {
    classpath "com.facebook.react:react-native-gradle-plugin"
  }
}
```

### 2. Update android/app/build.gradle

Add the React plugin and enable codegen:

```gradle
apply plugin: "com.facebook.react"

android {
  // ... your existing config
}

react {
  // Enable new architecture (recommended)
  newArchEnabled = true
  // Enable codegen (required)
  codegenEnabled = true
}
```

### 3. Update android/settings.gradle

```gradle
rootProject.name = 'YourAppName'
apply from: file("../node_modules/@react-native/gradle-plugin/settings.gradle")
```

### 4. Add required permissions to android/app/src/main/AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
<uses-permission android:name="android.permission.USE_FACE" />
<uses-permission android:name="android.permission.USE_IRIS" />
```

## iOS Configuration

### 1. Add permissions to ios/YourApp/Info.plist

```xml
<key>NSFaceIDUsageDescription</key>
<string>This app uses Face ID to securely log you in</string>
```

### 2. Ensure you have the required capabilities in Xcode

- Go to your project settings
- Select your target
- Go to "Signing & Capabilities"
- Add "Face ID" capability

## Codegen Configuration

### Option 1: Automatic (Recommended)

The library should work automatically with the above configuration. React Native will automatically generate the necessary native code.

### Option 2: Manual Configuration

If you encounter issues, add this to your `package.json`:

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

## Usage

### 1. Import the library

```typescript
import BiometricLogin from 'react-native-biometric-login';
```

### 2. Check biometric availability

```typescript
const isAvailable = await BiometricLogin.isBiometricAvailable();
```

### 3. Authenticate user

```typescript
try {
  const result = await BiometricLogin.authenticate({
    title: 'Login',
    subtitle: 'Use your biometric to login',
    description: 'Authenticate to access your account'
  });
  
  if (result.success) {
    // User authenticated successfully
    console.log('Authentication successful');
  }
} catch (error) {
  console.error('Authentication failed:', error);
}
```

### 4. Store credentials securely

```typescript
try {
  await BiometricLogin.storeCredentials({
    username: 'user@example.com',
    password: 'securepassword123'
  });
  console.log('Credentials stored successfully');
} catch (error) {
  console.error('Failed to store credentials:', error);
}
```

### 5. Retrieve stored credentials

```typescript
try {
  const credentials = await BiometricLogin.getStoredCredentials();
  console.log('Username:', credentials.username);
  // Use credentials.password for login
} catch (error) {
  console.error('Failed to retrieve credentials:', error);
}
```

## Troubleshooting

### Common Issues

1. **Build fails with CMake errors**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. **Codegen not working**: Ensure `codegenEnabled = true` in your build.gradle
3. **Permission denied**: Check AndroidManifest.xml and iOS Info.plist
4. **Library not found**: Run `pod install` for iOS, clean and rebuild for Android

### Build Commands

```bash
# Clean and rebuild Android
cd android
./gradlew clean
cd ..
yarn android

# Clean and rebuild iOS
cd ios
pod deintegrate
pod install
cd ..
yarn ios
```

## Example Implementation

Here's a complete example of how to implement biometric login:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import BiometricLogin from 'react-native-biometric-login';

const App = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await BiometricLogin.isBiometricAvailable();
      setIsAvailable(available);
    } catch (error) {
      console.error('Failed to check biometric availability:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await BiometricLogin.authenticate({
        title: 'Login',
        subtitle: 'Use your biometric to login',
        description: 'Authenticate to access your account'
      });

      if (result.success) {
        // Try to get stored credentials
        const credentials = await BiometricLogin.getStoredCredentials();
        if (credentials) {
          // Use credentials to login to your backend
          console.log('Logging in with stored credentials');
          setIsLoggedIn(true);
        } else {
          // No stored credentials, show login form
          Alert.alert('No stored credentials', 'Please login manually first');
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      Alert.alert('Authentication Failed', 'Please try again');
    }
  };

  const handleStoreCredentials = async () => {
    try {
      await BiometricLogin.storeCredentials({
        username: 'user@example.com',
        password: 'securepassword123'
      });
      Alert.alert('Success', 'Credentials stored securely');
    } catch (error) {
      console.error('Failed to store credentials:', error);
      Alert.alert('Error', 'Failed to store credentials');
    }
  };

  if (!isAvailable) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Biometric authentication not available</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Biometric Login Demo</Text>
      
      {!isLoggedIn ? (
        <TouchableOpacity onPress={handleLogin} style={{ marginTop: 20 }}>
          <Text>Login with Biometric</Text>
        </TouchableOpacity>
      ) : (
        <Text style={{ marginTop: 20 }}>Logged in successfully!</Text>
      )}
      
      <TouchableOpacity onPress={handleStoreCredentials} style={{ marginTop: 20 }}>
        <Text>Store Test Credentials</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
```

## Support

If you encounter issues:

1. Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide
2. Search existing [GitHub Issues](https://github.com/thang2162/react-native-biometric-login/issues)
3. Create a new issue with detailed information about your setup
4. Try the example app in this repository to verify functionality

## Version Compatibility

| React Native Version | Library Version | Notes |
|---------------------|-----------------|-------|
| 0.71.x - 0.80.x    | 2.0.x          | Full support |
| 0.81.x+            | 2.0.x          | Full support, recommended |
| < 0.71.x           | Not supported   | Upgrade React Native |
