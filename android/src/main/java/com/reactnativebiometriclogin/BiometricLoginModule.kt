package com.reactnativebiometriclogin

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.biometric.BiometricPrompt.PromptInfo
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*

class BiometricLoginModule(reactContext: ReactApplicationContext?) :
  ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return "BiometricLogin"
  }

  companion object {
    const val authenticators = (BiometricManager.Authenticators.BIOMETRIC_STRONG
      or BiometricManager.Authenticators.BIOMETRIC_WEAK
      or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
  }

  @ReactMethod
  fun BiometricIsAvailable(promise: Promise) = try {

    val context = reactApplicationContext
    val biometricManager = BiometricManager.from(context)
    val res = biometricManager.canAuthenticate(authenticators)
    val can = res == BiometricManager.BIOMETRIC_SUCCESS

    val creds = CredentialStore().GetUserCreds(context)
    promise.resolve(can)
  } catch (e: Exception) {
    promise.reject(e)
  }

  @ReactMethod
  fun BasicBiometricAuth(title: String?, desc: String?, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val context = reactApplicationContext
        val activity = currentActivity
        val mainExecutor = ContextCompat.getMainExecutor(context)
        val authenticationCallback: BiometricPrompt.AuthenticationCallback =
          object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationError(
              errorCode: Int,
              errString: CharSequence
            ) {
              super.onAuthenticationError(errorCode, errString)
              promise.reject(Exception(errString.toString()))
            }

            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
              super.onAuthenticationSucceeded(result)
              promise.resolve(true)
            }
          }
        if (activity != null) {
          val prompt = BiometricPrompt(
            (activity as FragmentActivity?)!!,
            mainExecutor,
            authenticationCallback
          )
          val promptInfo = PromptInfo.Builder()
            .setAllowedAuthenticators(authenticators)
            .setTitle(title!!)
            .setSubtitle(desc)
            .build()
          prompt.authenticate(promptInfo)
        } else {
          throw Exception("null activity")
        }
      } catch (e: Exception) {
        promise.reject(e)
      }
    }
  }

  @ReactMethod
  fun LoginBiometricAuth(title: String?, desc: String?, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val context = reactApplicationContext
        val activity = currentActivity
        val mainExecutor = ContextCompat.getMainExecutor(context)
        val authenticationCallback: BiometricPrompt.AuthenticationCallback =
          object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationError(
              errorCode: Int,
              errString: CharSequence
            ) {
              super.onAuthenticationError(errorCode, errString)
              promise.reject(Exception(errString.toString()))
            }

            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
              super.onAuthenticationSucceeded(result)
              val creds = CredentialStore().GetUserCreds(context)
              if (creds[0] == "" && creds[1] == "") {
                promise.reject("Please set a user.")
              } else {
                val map = Arguments.createMap()
                map.putBoolean("success", true)
                map.putString("username", CredentialStore().GetUserCreds(context)[0])
                map.putString("password", CredentialStore().GetUserCreds(context)[1])
                promise.resolve(map)
              }
            }
          }
        if (activity != null) {
          val prompt = BiometricPrompt(
            (activity as FragmentActivity?)!!,
            mainExecutor,
            authenticationCallback
          )
          val promptInfo = PromptInfo.Builder()
            .setAllowedAuthenticators(authenticators)
            .setTitle(title!!)
            .setSubtitle(desc)
            .build()
          prompt.authenticate(promptInfo)
        } else {
          throw Exception("null activity")
        }
      } catch (e: Exception) {
        promise.reject(e)
      }
    }
  }

  @ReactMethod
  fun SetUser(username: String?, password: String?, promise: Promise) = try {
    val context = reactApplicationContext
    val creds = CredentialStore().GetUserCreds(context)
    //promise.resolve(can)
    if (username == "" || username == null || password == "" || password == null) {
      promise.reject("Username and Password cannot be blank.")
    } else if (creds[0] == "" && creds[1] == "") {
      CredentialStore().SaveUserCreds(username, password, context)
      val map = Arguments.createMap()
      map.putBoolean("success", true)
      map.putString("message", "User set.")
      promise.resolve(map)
    } else {
      promise.reject("User already set.")
    }

  } catch (e: Exception) {
    promise.reject(e)
  }

  @ReactMethod
  fun UpdateUser(username: String?, password: String?, promise: Promise) = try {
    val context = reactApplicationContext
    val creds = CredentialStore().GetUserCreds(context)
    //promise.resolve(can)
    if (username == "" || username == null || password == "" || password == null) {
      promise.reject("Username and Password cannot be blank.")
    } else {
      CredentialStore().SaveUserCreds(username, password, context)
      val map = Arguments.createMap()
      map.putBoolean("success", true)
      map.putString("message", "User updated.")
      promise.resolve(map)
    }

  } catch (e: Exception) {
    promise.reject(e)
  }

  @ReactMethod
  fun GetUser(promise: Promise) = try {
    val context = reactApplicationContext
    val creds = CredentialStore().GetUserCreds(context)
    //promise.resolve(can)
    if (creds[0] == "" && creds[1] == "") {
      promise.reject("Please set a user.")
    } else {
      val map = Arguments.createMap()
      map.putBoolean("success", true)
      map.putString("username", CredentialStore().GetUserCreds(context)[0])
      map.putString("password", CredentialStore().GetUserCreds(context)[1])
      promise.resolve(map);
    }

  } catch (e: Exception) {
    promise.reject(e)
  }

  @ReactMethod
  fun DeleteUser(promise: Promise) = try {
    val context = reactApplicationContext
    val creds = CredentialStore().GetUserCreds(context)
    //promise.resolve(can)
    if (creds[0] == "" && creds[1] == "") {
      promise.reject("Please set a user.")
    } else {
      CredentialStore().DeleteUserCreds(context);
      val map = Arguments.createMap()
      map.putBoolean("success", true)
      map.putString("message", "User deleted.")
      promise.resolve(map)
    }

  } catch (e: Exception) {
    promise.reject(e)
  }

}
