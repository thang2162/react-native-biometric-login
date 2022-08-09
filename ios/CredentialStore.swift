//
//  CredentialStore.swift
//  BiometricLogin
//
//  Created by Tone T. Thangsongcharoen on 6/4/22.
//  Copyright © 2022 Facebook. All rights reserved.
//
import Security

class CredentialStore: NSObject {

    func GetAppId () -> String? {
        return "rn-biometric-login:creds:\(Bundle.main.bundleIdentifier ?? "")"
    }

    func SaveUserCreds(username: String, password: String) -> Bool? {
        // Set attributes
        let attributes: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrGeneric as String: "rn-biometric-login:creds:\(Bundle.main.bundleIdentifier ?? "")"  ,
            kSecAttrAccount as String: username,
            kSecValueData as String: password.data(using: .utf8)!,
        ]

        let status = SecItemAdd(attributes as CFDictionary, nil)

        // Add user
        if status == noErr {
            return true
        } else {
            print("Operation finished with status: \(status)")
            return false
        }
    }

    func GetUserCreds() -> Array<String>? {
        // Set query
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrGeneric as String: "rn-biometric-login:creds:\(Bundle.main.bundleIdentifier ?? "")",
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnAttributes as String: true,
            kSecReturnData as String: true,
        ]
        var item: CFTypeRef?

        // Check if user exists in the keychain
        if SecItemCopyMatching(query as CFDictionary, &item) == noErr {
            // Extract result
            if let existingItem = item as? [String: Any],
               let username = existingItem[kSecAttrAccount as String] as? String,
               let passwordData = existingItem[kSecValueData as String] as? Data,
               let password = String(data: passwordData, encoding: .utf8)
            {
                return [username, password]
            }
        } else {
            print("Something went wrong trying to find the user in the keychain")
            return ["No User Found"]
        }
        return []
    }

    func UpdateUser(username: String, password: String) -> Bool? {
      let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrGeneric as String: "rn-biometric-login:creds:\(Bundle.main.bundleIdentifier ?? "")",
      ]

      // Set attributes for the new password
      let attributes: [String: Any] = [
          kSecAttrAccount as String: username,
          kSecValueData as String: password.data(using: .utf8)!,
      ]

      // Find user and update
      if SecItemUpdate(query as CFDictionary, attributes as CFDictionary) == noErr {
        return true
      } else {
        return false
      }
    }

    func DeleteUserCreds() -> Bool? {
      // Set query
      let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrGeneric as String: "rn-biometric-login:creds:\(Bundle.main.bundleIdentifier ?? "")",
      ]

      // Find user and delete
      if SecItemDelete(query as CFDictionary) == noErr {
        return true
      } else {
        return false
      }
    }

}
