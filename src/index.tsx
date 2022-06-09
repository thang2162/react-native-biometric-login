import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-biometric-login' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const BiometricLogin = NativeModules.BiometricLogin
  ? NativeModules.BiometricLogin
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function BiometricIsAvailable(): Promise<boolean> {
  return BiometricLogin.BiometricIsAvailable();
}

export function BasicBiometricAuth(
  title: string = 'Biometric login for my app',
  desc: string = 'Log in using your biometric credential'
): Promise<any> {
  return BiometricLogin.BasicBiometricAuth(title, desc);
}

export function LoginBiometricAuth(
  title: string = 'Biometric login for my app',
  desc: string = 'Log in using your biometric credential'
): Promise<any> {
  return BiometricLogin.LoginBiometricAuth(title, desc);
}

export function SetUser(username: string, password: string): Promise<any> {
  return BiometricLogin.SetUser(username, password);
}

export function UpdateUser(
  username: string,
  password: string
): Promise<any> {
  return BiometricLogin.UpdateUser(username, password);
}

export function GetUser(): Promise<any> {
  return BiometricLogin.GetUser();
}

export function DeleteUser(): Promise<any> {
  return BiometricLogin.DeleteUser();
}
