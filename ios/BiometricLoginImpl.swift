import Foundation
import LocalAuthentication
import Security

@objcMembers
@objc(BiometricLoginImpl)
public class BiometricLoginImpl: NSObject {
    
    private let keychainService = "com.biometriclogin.credentials"
    private let usernameKey = "username"
    private let passwordKey = "password"
    
    public override init() {
        super.init()
    }
    
    @objc
    public func biometricIsAvailable() -> Bool {
        let context = LAContext()
        var error: NSError?
        
        return context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    }
    
    @objc
    public func basicBiometricAuth(title: String, desc: String, completion: @escaping (Bool) -> Void) {
        let context = LAContext()
        context.localizedFallbackTitle = "Use Passcode"
        
        let reason = desc.isEmpty ? "Please authenticate" : desc
        
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
            DispatchQueue.main.async {
                completion(success)
            }
        }
    }
    
    @objc
    public func loginBiometricAuth(title: String, desc: String, completion: @escaping (Bool, String?, UserCredentials?) -> Void) {
        // First check if user credentials exist
        guard let storedCredentials = getStoredCredentials() else {
            completion(false, "No stored credentials found", nil)
            return
        }
        
        let context = LAContext()
        context.localizedFallbackTitle = "Use Passcode"
        
        let reason = desc.isEmpty ? "Please authenticate to log in" : desc
        
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
            DispatchQueue.main.async {
                if success {
                    completion(true, nil, storedCredentials)
                } else {
                    let errorMessage = error?.localizedDescription ?? "Authentication failed"
                    completion(false, errorMessage, nil)
                }
            }
        }
    }
    
    @objc
    public func setUser(username: String, password: String) -> Bool {
        let credentials = UserCredentials(username: username, password: password)
        return storeCredentials(credentials)
    }
    
    @objc
    public func updateUser(username: String, password: String) -> Bool {
        // First delete existing credentials
        _ = deleteStoredCredentials()
        
        // Then save new ones
        let credentials = UserCredentials(username: username, password: password)
        return storeCredentials(credentials)
    }
    
    @objc
    public func getUser() -> UserCredentials? {
        return getStoredCredentials()
    }
    
    @objc
    public func deleteUser() -> Bool {
        return deleteStoredCredentials()
    }
    
    // MARK: - Private Methods
    
    private func storeCredentials(_ credentials: UserCredentials) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: usernameKey,
            kSecValueData as String: credentials.username.data(using: .utf8)!,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        let passwordQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: passwordKey,
            kSecValueData as String: credentials.password.data(using: .utf8)!,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        // Delete existing items first
        _ = SecItemDelete(query as CFDictionary)
        _ = SecItemDelete(passwordQuery as CFDictionary)
        
        // Add new items
        let usernameStatus = SecItemAdd(query as CFDictionary, nil)
        let passwordStatus = SecItemAdd(passwordQuery as CFDictionary, nil)
        
        return usernameStatus == errSecSuccess && passwordStatus == errSecSuccess
    }
    
    private func getStoredCredentials() -> UserCredentials? {
        let usernameQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: usernameKey,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        let passwordQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: passwordKey,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var usernameResult: AnyObject?
        var passwordResult: AnyObject?
        
        let usernameStatus = SecItemCopyMatching(usernameQuery as CFDictionary, &usernameResult)
        let passwordStatus = SecItemCopyMatching(passwordQuery as CFDictionary, &passwordResult)
        
        guard usernameStatus == errSecSuccess,
              passwordStatus == errSecSuccess,
              let usernameData = usernameResult as? Data,
              let passwordData = passwordResult as? Data,
              let username = String(data: usernameData, encoding: .utf8),
              let password = String(data: passwordData, encoding: .utf8) else {
            return nil
        }
        
        return UserCredentials(username: username, password: password)
    }
    
    private func deleteStoredCredentials() -> Bool {
        let usernameQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: usernameKey
        ]
        
        let passwordQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: passwordKey
        ]
        
        let usernameStatus = SecItemDelete(usernameQuery as CFDictionary)
        let passwordStatus = SecItemDelete(passwordQuery as CFDictionary)
        
        return usernameStatus == errSecSuccess && passwordStatus == errSecSuccess
    }
}

// MARK: - Helper Classes

@objc
public class UserCredentials: NSObject {
    @objc public let username: String
    @objc public let password: String
    
    public init(username: String, password: String) {
        self.username = username
        self.password = password
        super.init()
    }
}
