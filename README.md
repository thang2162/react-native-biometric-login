# react-native-biometric-login

A React-Native module to enable biometric login and securely store a user's credentials using native apis. The user's credentials are encrypted and stored using Keychain on iOS and Encrypted Shared Preferences on Android.

## Installation

```sh
npm install react-native-biometric-login --save

cd ios && pod install && cd ..
```

or

```sh
yarn add react-native-biometric-login

cd ios && pod install && cd ..
```

## Usage

```js
import {
  BiometricIsAvailable,
  BasicBiometricAuth,
  LoginBiometricAuth,
  SetUser,
  UpdateUser,
  GetUser,
  DeleteUser,
} from 'react-native-biometric-login';

// ...

const result = await BiometricIsAvailable();
```

## API

1. BiometricIsAvailable() - Checks if a biometric authentication method is available on the device.
   Returns: Promise that resolves with true or false

2. BasicBiometricAuth(title: string, description: string) - Opens a basic biometric login prompt.
   Returns: Promise that resolves with true if success or rejects with message if fail.

3. LoginBiometricAuth(title: string, description: string) - Opens a biometric login prompt that returns stored user credentials.
   Returns: Promise that resolves with object {success: true, username: "username", password: "password"} if success or rejects with message if fail.

4. SetUser(username: string, password: string) - Save the user's credentials.
   Returns: Promise that resolves with object {success: true, message: response_text} if success or rejects with message if fail.

5. UpdateUser(username: string, password: string) - Update the user's credentials.
   Returns: Promise that resolves with object {success: true, message: response_text} if success or rejects with message if fail.

6. GetUser() - Gets the user's credentials.
   Returns: Promise that resolves with object {success: true, username: "username", password: "password"} if success or rejects with message if fail.

7. DeleteUser() - Deletes the user's credentials.
   Returns: Promise that resolves with object {success: true, message: response_text} if success or rejects with message if fail.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
