package com.reactnativebiometriclogin

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey


class CredentialStore {

  fun SaveUserCreds(username: String, password: String, context: Context) {
    val masterKeyAlias = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

    val sharedPreferences = EncryptedSharedPreferences.create(
            context,
      "CredentialStore",
      masterKeyAlias,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    sharedPreferences.edit()
      .putString("username", username)
      .putString("password", password)
      .apply()

  }

  fun GetUserCreds(context: Context): Array<String> {
    val masterKeyAlias = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

    val sharedPreferences = EncryptedSharedPreferences.create(
            context,
      "CredentialStore",
      masterKeyAlias,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    val username: String = sharedPreferences.getString("username", "").toString()
    val password: String = sharedPreferences.getString("password", "").toString()

    return arrayOf(username, password)
  }

  fun DeleteUserCreds(context: Context) {
    val masterKeyAlias = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

    val sharedPreferences = EncryptedSharedPreferences.create(
            context,
      "CredentialStore",
      masterKeyAlias,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    sharedPreferences.edit()
      .remove("username")
      .remove("password")
      .apply()
  }
}
