import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface User {
  username: string;
  password: string;
}

export interface Spec extends TurboModule {
  BiometricIsAvailable(): Promise<boolean>;
  BasicBiometricAuth(title: string, desc: string): Promise<boolean>;
  LoginBiometricAuth(title: string, desc: string): Promise<User>;
  SetUser(username: string, password: string): Promise<boolean>;
  UpdateUser(username: string, password: string): Promise<boolean>;
  GetUser(): Promise<User>;
  DeleteUser(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BiometricLogin');
