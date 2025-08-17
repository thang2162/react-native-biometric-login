import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BiometricLogin } from 'react-native-biometric-login';
import type { User } from 'react-native-biometric-login';

export default function App() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    loadCurrentUser();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await BiometricLogin.BiometricIsAvailable();
      setIsAvailable(available);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await BiometricLogin.GetUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleBasicAuth = async () => {
    if (!isAvailable) {
      Alert.alert('Error', 'Biometric authentication is not available');
      return;
    }

    setLoading(true);
    try {
      const result = await BiometricLogin.BasicBiometricAuth(
        'Biometric Authentication',
        'Please authenticate using your biometric credentials'
      );
      if (result) {
        Alert.alert('Success', 'Basic authentication successful!');
      } else {
        Alert.alert('Error', 'Authentication failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAuth = async () => {
    if (!isAvailable) {
      Alert.alert('Error', 'Biometric authentication is not available');
      return;
    }

    setLoading(true);
    try {
      const result = await BiometricLogin.LoginBiometricAuth(
        'Login with Biometrics',
        'Please authenticate to log in'
      );
      Alert.alert('Success', `Login successful! Username: ${result.username}`);
      loadCurrentUser(); // Refresh the current user display
    } catch (error) {
      Alert.alert('Error', 'Login failed: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetUser = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await BiometricLogin.SetUser(username, password);
      if (result) {
        Alert.alert('Success', 'User credentials saved successfully!');
        setUsername('');
        setPassword('');
        loadCurrentUser();
      } else {
        Alert.alert('Error', 'Failed to save user credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save user: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await BiometricLogin.UpdateUser(username, password);
      if (result) {
        Alert.alert('Success', 'User credentials updated successfully!');
        setUsername('');
        setPassword('');
        loadCurrentUser();
      } else {
        Alert.alert('Error', 'Failed to update user credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update user: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const result = await BiometricLogin.DeleteUser();
      if (result) {
        Alert.alert('Success', 'User credentials deleted successfully!');
        setCurrentUser(null);
      } else {
        Alert.alert('Error', 'Failed to delete user credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Biometric Login Demo</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Biometric Status:</Text>
          <Text
            style={[
              styles.statusText,
              // eslint-disable-next-line react-native/no-inline-styles
              { color: isAvailable ? 'green' : 'red' },
            ]}
          >
            {isAvailable === null
              ? 'Checking...'
              : isAvailable
                ? 'Available'
                : 'Not Available'}
          </Text>
        </View>

        {currentUser && (
          <View style={styles.userContainer}>
            <Text style={styles.userLabel}>Current User:</Text>
            <Text style={styles.userText}>
              {JSON.stringify(currentUser, null, 2)}
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSetUser}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Set User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleUpdateUser}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Update User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={handleBasicAuth}
            disabled={loading || !isAvailable}
          >
            <Text style={styles.buttonText}>Basic Auth</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.infoButton]}
            onPress={handleLoginAuth}
            disabled={loading || !isAvailable}
          >
            <Text style={styles.buttonText}>Login Auth</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleDeleteUser}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Delete User</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  userText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#333', // Explicit text color for Android
    textAlignVertical: 'center', // Android-specific alignment
    includeFontPadding: false, // Android-specific font padding fix
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // Ensure proper contrast on all platforms
    ...(Platform.OS === 'android' && {
      color: '#333',
      textAlignVertical: 'center',
      includeFontPadding: false,
      selectionColor: '#007AFF',
      cursorColor: '#007AFF',
    }),
    ...(Platform.OS === 'ios' && {
      color: '#333',
    }),
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#5856D6',
  },
  successButton: {
    backgroundColor: '#34C759',
  },
  infoButton: {
    backgroundColor: '#5AC8FA',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
