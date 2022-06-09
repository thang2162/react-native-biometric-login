import LocalAuthentication

@objc(BiometricLogin)
class BiometricLogin: NSObject {

    @objc(BiometricIsAvailable:withRejecter:)
    func BiometricIsAvailable(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        let context = LAContext()
        var la_error: NSError?
        let canEvaluatePolicy = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &la_error)

        if canEvaluatePolicy {
            resolve(NSNumber(value: true))
        } else {
            resolve(NSNumber(value: false))
        }
    }

    @objc(BasicBiometricAuth:withDesc:withResolver:withRejecter:)
    func BasicBiometricAuth(title: String, desc: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.global(qos: .default).async(execute: {
        let localAuthenticationContext = LAContext()
                localAuthenticationContext.localizedFallbackTitle = title

        let reasonString = desc

        localAuthenticationContext.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reasonString) { success, evaluateError in

                        if success {

                            //TODO: User authenticated successfully, take appropriate action
                            resolve(NSNumber(value: true))
                        } else {
                            //TODO: User did not authenticate successfully, look at error and take appropriate action

                            let message = "\(evaluateError?.localizedDescription ?? "")"
                            reject("Error: ", message, nil)

                            //TODO: If you have choosen the 'Fallback authentication mechanism selected' (LAError.userFallback). Handle gracefully

                        }
                    }
        })
    }

    @objc(LoginBiometricAuth:withDesc:withResolver:withRejecter:)
    func LoginBiometricAuth(title: String, desc: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.global(qos: .default).async(execute: {
        let localAuthenticationContext = LAContext()
                localAuthenticationContext.localizedFallbackTitle = title

        let reasonString = desc

        localAuthenticationContext.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reasonString) { success, evaluateError in

                        if success {

                            //TODO: User authenticated successfully, take appropriate action
                            let data = CredentialStore().GetUserCreds() ?? []

                            if (data.count == 2) {
                                let formattedData: NSDictionary = [
                                    "success" : NSNumber(value: true),
                                    "username" : data[0],
                                    "password" : data[1]
                                ]
                                resolve(formattedData)
                            } else {
                              reject("Error: ", "Please set a user.", nil)
                            }
                        } else {
                            //TODO: User did not authenticate successfully, look at error and take appropriate action

                            let message = "\(evaluateError?.localizedDescription ?? "")"
                            reject("Error: ", message, nil)

                            //TODO: If you have choosen the 'Fallback authentication mechanism selected' (LAError.userFallback). Handle gracefully

                        }
                    }
        })
    }

    @objc(SetUser:withPassword:withResolver:withRejecter:)
    func SetUser(username: String? = nil, password: String? = nil, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {

            let data = CredentialStore().GetUserCreds() ?? []

            if (data.count == 2) {
                reject("Error: ", "User already set.", nil)
            } else if (data.count <= 1) {
                if (username != nil && username != "" && password != nil && password != "") {
                  let saveRes: Bool? = CredentialStore().SaveUserCreds(username: username ?? "", password: password ?? "");
                  if (saveRes == true) {
                    let formattedData: NSDictionary = [
                        "success" : NSNumber(value: true),
                        "message" :"User set."
                    ]
                    resolve(formattedData)
                  } else {
                    reject("Error: ", "Error setting user.", nil)
                  }
                } else {
                  reject("Error: ", "Username and Password cannot be blank.", nil)
                }
            }
    }

    @objc(UpdateUser:withPassword:withResolver:withRejecter:)
    func UpdateUser(username: String? = nil, password: String? = nil, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {

            let data = CredentialStore().GetUserCreds() ?? []

            if (data.count == 2) {
              if (username != nil && username != "" && password != nil && password != "") {
                let saveRes: Bool? = CredentialStore().UpdateUser(username: username ?? "", password: password ?? "");
                if (saveRes == true) {
                  let formattedData: NSDictionary = [
                      "success" : NSNumber(value: true),
                      "message" :"User updated."
                  ]
                  resolve(formattedData)
                } else {
                  reject("Error: ", "Error updating user.", nil)
                }
              } else {
                reject("Error: ", "Username and Password cannot be blank.", nil)
              }
            } else if (data.count <= 1) {
              reject("Error: ", "Please set a user.", nil)
            }
    }

    @objc(GetUser:withRejecter:)
    func GetUser(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
      let data = CredentialStore().GetUserCreds() ?? []

      if (data.count == 2) {
          let formattedData: NSDictionary = [
              "success" : NSNumber(value: true),
              "username" : data[0],
              "helloString" : data[1]
          ]
          resolve(formattedData)
      } else {
        reject("Error: ", "Please set a user.", nil)
      }
    }

    @objc(DeleteUser:withRejecter:)
    func DeleteUser(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
      let data = CredentialStore().GetUserCreds() ?? []

      if (data.count == 2) {
        let saveRes: Bool? = CredentialStore().DeleteUserCreds();
        if (saveRes == true) {
          let formattedData: NSDictionary = [
              "success" : NSNumber(value: true),
              "message" :"User deleted."
          ]
          resolve(formattedData)
        } else {
          reject("Error: ", "Error deleting user.", nil)
        }
      } else {
        reject("Error: ", "Please set a user.", nil)
      }
    }

}
