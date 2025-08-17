package com.biometriclogin

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson

class CredentialStorage(context: Context) {
    private val sharedPreferences: SharedPreferences = context.getSharedPreferences(
        PREF_NAME, Context.MODE_PRIVATE
    )
    private val cryptoManager = CryptoManager(context)
    private val gson = Gson()
    
    fun saveUser(user: User): Boolean {
        return try {
            val userJson = gson.toJson(user)
            val encryptedData = cryptoManager.encrypt(userJson.toByteArray(), "user_credentials")
            sharedPreferences.edit()
                .putString(KEY_USER_CREDENTIALS, encryptedData)
                .apply()
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    fun getUser(): User? {
        return try {
            val encryptedData = sharedPreferences.getString(KEY_USER_CREDENTIALS, null)
            if (encryptedData != null) {
                val decryptedBytes = cryptoManager.decrypt(encryptedData, "user_credentials")
                val userJson = String(decryptedBytes)
                gson.fromJson(userJson, User::class.java)
            } else {
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    
    fun deleteUser(): Boolean {
        return try {
            sharedPreferences.edit()
                .remove(KEY_USER_CREDENTIALS)
                .apply()
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    fun hasUser(): Boolean {
        return sharedPreferences.contains(KEY_USER_CREDENTIALS)
    }
    
    companion object {
        private const val PREF_NAME = "biometric_login_prefs"
        private const val KEY_USER_CREDENTIALS = "encrypted_user_credentials"
    }
}
