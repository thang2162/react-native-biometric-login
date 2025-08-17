package com.biometriclogin

import android.content.Context
import android.os.Build
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.biometriclogin.NativeBiometricLoginSpec
import java.util.concurrent.Executor

class BiometricLoginModule(reactContext: ReactApplicationContext) :
    NativeBiometricLoginSpec(reactContext) {

    private val credentialStorage = CredentialStorage(reactContext)
    private val biometricManager = BiometricManager.from(reactContext)
    private val executor = ContextCompat.getMainExecutor(reactContext)



    override fun BiometricIsAvailable(promise: Promise) {
        try {
            val canAuthenticate = when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)) {
                BiometricManager.BIOMETRIC_SUCCESS -> true
                BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> false
                BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> false
                BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> false
                else -> false
            }
            promise.resolve(canAuthenticate)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check biometric availability: ${e.message}")
        }
    }

    override fun BasicBiometricAuth(title: String, desc: String, promise: Promise) {
        try {
            val activity = currentActivity as? FragmentActivity
            if (activity == null) {
                promise.reject("ERROR", "Activity not available or not a FragmentActivity")
                return
            }

            // Ensure we run on the main thread
            activity.runOnUiThread {
                try {
                    val biometricPrompt = BiometricPrompt(activity, executor,
                        object : BiometricPrompt.AuthenticationCallback() {
                            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                                promise.reject("ERROR", "Authentication error: $errString")
                            }

                            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                                promise.resolve(true)
                            }

                            override fun onAuthenticationFailed() {
                                promise.resolve(false)
                            }
                        })

                    val promptInfo = BiometricPrompt.PromptInfo.Builder()
                        .setTitle(title)
                        .setSubtitle(desc)
                        .setNegativeButtonText("Cancel")
                        .build()

                    biometricPrompt.authenticate(promptInfo)
                } catch (e: Exception) {
                    promise.reject("ERROR", "Failed to start biometric authentication: ${e.message}")
                }
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to start biometric authentication: ${e.message}")
        }
    }

    override fun LoginBiometricAuth(title: String, desc: String, promise: Promise) {
        try {
            val user = credentialStorage.getUser()
            if (user == null) {
                promise.reject("ERROR", "No stored credentials found")
                return
            }

            val activity = currentActivity as? FragmentActivity
            if (activity == null) {
                promise.reject("ERROR", "Activity not available or not a FragmentActivity")
                return
            }

            // Ensure we run on the main thread
            activity.runOnUiThread {
                try {
                    val biometricPrompt = BiometricPrompt(activity, executor,
                        object : BiometricPrompt.AuthenticationCallback() {
                            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                                promise.reject("ERROR", "Authentication error: $errString")
                            }

                            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                                val userMap = Arguments.createMap().apply {
                                    putString("username", user.username)
                                    putString("password", user.password)
                                }
                                promise.resolve(userMap)
                            }

                            override fun onAuthenticationFailed() {
                                promise.reject("ERROR", "Authentication failed")
                            }
                        })

                    val promptInfo = BiometricPrompt.PromptInfo.Builder()
                        .setTitle(title)
                        .setSubtitle(desc)
                        .setNegativeButtonText("Cancel")
                        .build()

                    biometricPrompt.authenticate(promptInfo)
                } catch (e: Exception) {
                    promise.reject("ERROR", "Failed to start biometric authentication: ${e.message}")
                }
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to start biometric authentication: ${e.message}")
        }
    }

    override fun SetUser(username: String, password: String, promise: Promise) {
        try {
            val user = User(username, password)
            val success = credentialStorage.saveUser(user)
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to save user: ${e.message}")
        }
    }

    override fun UpdateUser(username: String, password: String, promise: Promise) {
        try {
            val user = User(username, password)
            val success = credentialStorage.saveUser(user)
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to update user: ${e.message}")
        }
    }

    override fun GetUser(promise: Promise) {
        try {
            val user = credentialStorage.getUser()
            if (user != null) {
                val userMap = Arguments.createMap().apply {
                    putString("username", user.username)
                    putString("password", user.password)
                }
                promise.resolve(userMap)
            } else {
                promise.reject("ERROR", "No user found")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get user: ${e.message}")
        }
    }

    override fun DeleteUser(promise: Promise) {
        try {
            val success = credentialStorage.deleteUser()
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to delete user: ${e.message}")
        }
    }

    companion object {
        const val NAME = "BiometricLogin"
    }
}
