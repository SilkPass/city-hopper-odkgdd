
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, darkColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

type AuthMode = 'welcome' | 'login' | 'register';

export default function WelcomeScreen() {
  const { login, register, continueAsGuest } = useAuth();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;

  const [mode, setMode] = useState<AuthMode>('welcome');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(username.trim(), password);
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)/(home)');
    } else {
      Alert.alert('Login Failed', result.error || 'Please try again');
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await register(username.trim(), email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/(home)') },
      ]);
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  const handleGuestMode = async () => {
    await continueAsGuest();
    router.replace('/(tabs)/(home)');
  };

  const renderWelcomeScreen = () => (
    <View style={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <IconSymbol
          ios_icon_name="building.2.fill"
          android_material_icon_name="location_city"
          size={80}
          color={currentColors.primary}
        />
        <Text style={[styles.title, { color: currentColors.text }]}>
          City Hopper
        </Text>
        <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
          Explore cities around the world
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: currentColors.primary }]}
          onPress={() => setMode('register')}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: currentColors.primary }]}
          onPress={() => setMode('login')}
        >
          <Text style={[styles.secondaryButtonText, { color: currentColors.primary }]}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestMode}
        >
          <Text style={[styles.guestButtonText, { color: currentColors.textSecondary }]}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoginScreen = () => (
    <ScrollView
      style={styles.formScrollView}
      contentContainerStyle={styles.formContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setMode('welcome')}
      >
        <IconSymbol
          ios_icon_name="chevron.left"
          android_material_icon_name="arrow_back"
          size={24}
          color={currentColors.text}
        />
      </TouchableOpacity>

      <Text style={[styles.formTitle, { color: currentColors.text }]}>
        Welcome Back
      </Text>
      <Text style={[styles.formSubtitle, { color: currentColors.textSecondary }]}>
        Sign in to continue
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          Username
        </Text>
        <View style={[styles.inputWrapper, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
          <IconSymbol
            ios_icon_name="at"
            android_material_icon_name="alternate_email"
            size={20}
            color={currentColors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: currentColors.text }]}
            placeholder="@username"
            placeholderTextColor={currentColors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          Password
        </Text>
        <View style={[styles.inputWrapper, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={20}
            color={currentColors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: currentColors.text }]}
            placeholder="Enter password"
            placeholderTextColor={currentColors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <IconSymbol
              ios_icon_name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
              android_material_icon_name={showPassword ? 'visibility_off' : 'visibility'}
              size={20}
              color={currentColors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: currentColors.primary },
          isLoading && styles.submitButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.switchModeContainer}>
        <Text style={[styles.switchModeText, { color: currentColors.textSecondary }]}>
          Don&apos;t have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => setMode('register')}>
          <Text style={[styles.switchModeLink, { color: currentColors.primary }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderRegisterScreen = () => (
    <ScrollView
      style={styles.formScrollView}
      contentContainerStyle={styles.formContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setMode('welcome')}
      >
        <IconSymbol
          ios_icon_name="chevron.left"
          android_material_icon_name="arrow_back"
          size={24}
          color={currentColors.text}
        />
      </TouchableOpacity>

      <Text style={[styles.formTitle, { color: currentColors.text }]}>
        Create Account
      </Text>
      <Text style={[styles.formSubtitle, { color: currentColors.textSecondary }]}>
        Sign up to get started
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          Username (with @)
        </Text>
        <View style={[styles.inputWrapper, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
          <IconSymbol
            ios_icon_name="at"
            android_material_icon_name="alternate_email"
            size={20}
            color={currentColors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: currentColors.text }]}
            placeholder="@username"
            placeholderTextColor={currentColors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          Email
        </Text>
        <View style={[styles.inputWrapper, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
          <IconSymbol
            ios_icon_name="envelope.fill"
            android_material_icon_name="email"
            size={20}
            color={currentColors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: currentColors.text }]}
            placeholder="email@example.com"
            placeholderTextColor={currentColors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          Password
        </Text>
        <View style={[styles.inputWrapper, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={20}
            color={currentColors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: currentColors.text }]}
            placeholder="Min. 6 characters"
            placeholderTextColor={currentColors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <IconSymbol
              ios_icon_name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
              android_material_icon_name={showPassword ? 'visibility_off' : 'visibility'}
              size={20}
              color={currentColors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          Confirm Password
        </Text>
        <View style={[styles.inputWrapper, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={20}
            color={currentColors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: currentColors.text }]}
            placeholder="Re-enter password"
            placeholderTextColor={currentColors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <IconSymbol
              ios_icon_name={showConfirmPassword ? 'eye.slash.fill' : 'eye.fill'}
              android_material_icon_name={showConfirmPassword ? 'visibility_off' : 'visibility'}
              size={20}
              color={currentColors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: currentColors.primary },
          isLoading && styles.submitButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.switchModeContainer}>
        <Text style={[styles.switchModeText, { color: currentColors.textSecondary }]}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => setMode('login')}>
          <Text style={[styles.switchModeLink, { color: currentColors.primary }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {mode === 'welcome' && renderWelcomeScreen()}
        {mode === 'login' && renderLoginScreen()}
        {mode === 'register' && renderRegisterScreen()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 14,
  },
  formScrollView: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchModeText: {
    fontSize: 14,
  },
  switchModeLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
