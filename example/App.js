/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  BiometricIsAvailable,
  BasicBiometricAuth,
  LoginBiometricAuth,
  SetUser,
  UpdateUser,
  GetUser,
  DeleteUser,
} from 'react-native-biometric-login';

const Separator = () => (
  <View style={styles.separator} />
);

const App = () => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>
        Is there an available biometric sensor?
      </Text>
      <Button
        title="Execute"
        color="green"
        onPress={() => {
          BiometricIsAvailable().then(res => {
            Alert.alert(JSON.stringify(res))
            }).catch(e => {
              Alert.alert(e.toString())
              })
          }}
      />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>
        Basic Biometric Prompt
      </Text>
      <Button
        title="Execute"
        color="#f194ff"
        onPress={() => {
          BasicBiometricAuth().then(res => {
            Alert.alert(JSON.stringify(res))
            }).catch(e => {
              Alert.alert(e.toString())
              })
          }}
      />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>
        Biometric Prompt with stored credentials returned.
      </Text>
      <Button
        title="Execute"
        color="red"
        onPress={() => {
          LoginBiometricAuth().then(res => {
            Alert.alert(JSON.stringify(res))
            }).catch(e => {
              Alert.alert(e.toString())
              })
          }}
      />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>
        Credential Store Functions
      </Text>
      <View style={styles.fixToText}>
        <Button
          title="Set User"
          onPress={() => {
            SetUser("John", "1234Doe").then(res => {
              Alert.alert(JSON.stringify(res))
              }).catch(e => {
                Alert.alert(e.toString())
                })
            }}
        />
        <Button
          title="Update User"
          onPress={() => {
            UpdateUser("Jane", "Doe5678").then(res => {
              Alert.alert(JSON.stringify(res))
              }).catch(e => {
                Alert.alert(e.toString())
                })
            }}
        />
      </View>
    </View>
    <View style={{marginTop: 15}}>
      <View style={styles.fixToText}>
        <Button
          title="Get User"
          onPress={() => {
            GetUser().then(res => {
              Alert.alert(JSON.stringify(res))
              }).catch(e => {
                Alert.alert(e.toString())
                })
            }}
        />
        <Button
          title="Delete User"
          onPress={() => {
            DeleteUser().then(res => {
              Alert.alert(JSON.stringify(res))
              }).catch(e => {
                Alert.alert(e.toString())
                })
            }}
        />
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
