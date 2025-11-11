
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Crimson-based modernist color palette
export const colors = {
  // Light mode colors - Crimson modernist theme
  background: '#FAFAFA',
  backgroundSecondary: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
  primary: '#DC143C', // Crimson
  primaryLight: '#E84A67',
  primaryDark: '#B01030',
  secondary: '#2C2C2C', // Dark gray for modernist feel
  accent: '#8B0000', // Dark red accent
  card: '#FFFFFF',
  cardSecondary: '#F5F5F5',
  highlight: '#DC143C',
  border: '#E0E0E0',
  separator: '#ECECEC',
  
  // Semantic colors
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
};

// Dark mode colors - Crimson modernist theme
export const darkColors = {
  background: '#0A0A0A',
  backgroundSecondary: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#6B6B6B',
  primary: '#FF6B8A', // Lighter crimson for dark mode
  primaryLight: '#FF8FA8',
  primaryDark: '#DC143C',
  secondary: '#E0E0E0', // Light gray for modernist feel
  accent: '#FF4D6D', // Bright red accent
  card: '#1A1A1A',
  cardSecondary: '#252525',
  highlight: '#FF6B8A',
  border: '#2C2C2C',
  separator: '#2C2C2C',
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
  accentButton: {
    backgroundColor: colors.accent,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  text: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
  },
});
