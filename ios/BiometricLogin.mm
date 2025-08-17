#import "BiometricLogin.h"
#import <LocalAuthentication/LocalAuthentication.h>
#import <Security/Security.h>
#import "BiometricLogin-Swift.h"

@implementation BiometricLogin

RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBiometricLoginSpecJSI>(params);
}


- (void)BiometricIsAvailable:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject
{
    @try {
        BiometricLoginImpl *impl = [[BiometricLoginImpl alloc] init];
        BOOL result = [impl biometricIsAvailable];
        resolve(@(result));
    } @catch (NSException *exception) {
        reject(@"BIOMETRIC_ERROR", [NSString stringWithFormat:@"Exception: %@", exception.reason], nil);
    }
}

- (void)BasicBiometricAuth:(NSString *)title
                      desc:(NSString *)desc
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
    @try {
        BiometricLoginImpl *impl = [[BiometricLoginImpl alloc] init];
        
        [impl basicBiometricAuthWithTitle:title desc:desc completion:^(BOOL success) {
            resolve(@(success));
        }];
        
    } @catch (NSException *exception) {
        reject(@"AUTH_ERROR", [NSString stringWithFormat:@"Exception: %@", exception.reason], nil);
    }
}

- (void)LoginBiometricAuth:(NSString *)title
                      desc:(NSString *)desc
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
    @try {
        BiometricLoginImpl *impl = [[BiometricLoginImpl alloc] init];
        
        [impl loginBiometricAuthWithTitle:title desc:desc completion:^(BOOL success, NSString * _Nullable errorMessage, UserCredentials * _Nullable credentials) {
            if (success && credentials) {
                NSDictionary *response = @{
                    @"username": credentials.username ?: @"",
                    @"password": credentials.password ?: @""
                };
                resolve(response);
            } else {
                reject(@"LOGIN_ERROR", errorMessage ?: @"Authentication failed", nil);
            }
        }];
        
    } @catch (NSException *exception) {
        reject(@"LOGIN_ERROR", [NSString stringWithFormat:@"Exception: %@", exception.reason], nil);
    }
}

- (void)SetUser:(NSString *)username
       password:(NSString *)password
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject
{
    @try {
        BiometricLoginImpl *impl = [[BiometricLoginImpl alloc] init];
        BOOL result = [impl setUserWithUsername:username password:password];
        resolve(@(result));
    } @catch (NSException *exception) {
        reject(@"SET_USER_ERROR", [NSString stringWithFormat:@"Exception: %@", exception.reason], nil);
    }
}

- (void)UpdateUser:(NSString *)username
          password:(NSString *)password
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
    @try {
        BiometricLoginImpl *impl = [[BiometricLoginImpl alloc] init];
        BOOL result = [impl updateUserWithUsername:username password:password];
        resolve(@(result));
    } @catch (NSException *exception) {
        reject(@"UPDATE_USER_ERROR", [NSString stringWithFormat:@"Exception: %@", exception.reason], nil);
    }
}

- (void)GetUser:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject
{
    @try {
        BiometricLoginImpl *impl = [[BiometricLoginImpl alloc] init];
        UserCredentials *credentials = [impl getUser];
        
        if (credentials) {
            NSDictionary *result = @{
                @"username": credentials.username ?: @"",
                @"password": credentials.password ?: @""
            };
            resolve(result);
        } else {
            reject(@"GET_USER_ERROR", @"No stored credentials found", nil);
        }
    } @catch (NSException *exception) {
        reject(@"GET_USER_ERROR", [NSString stringWithFormat:@"Exception: %@", exception.reason], nil);
    }
}

- (void)DeleteUser:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
    @try {
        BiometricLoginImpl *impl = [[BiometricLoginImpl alloc] init];
        BOOL result = [impl deleteUser];
        resolve(@(result));
    } @catch (NSException *exception) {
        reject(@"DELETE_USER_ERROR", [NSString stringWithFormat:@"Exception: %@", exception.reason], nil);
    }
}

@end
