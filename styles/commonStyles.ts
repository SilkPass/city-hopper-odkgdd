
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Crimson as the main color with iOS 26 inspired palette
export const colors = {
  // Light mode colors
  background: '#F2F2F7',
  backgroundSecondary: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  primary: '#DC143C', // Crimson
  primaryLight: '#FF6B8A',
  primaryDark: '#B01030',
  secondary: '#34C759',
  accent: '#FF9500',
  card: '#FFFFFF',
  cardSecondary: '#F2F2F7',
  highlight: '#FFCC00',
  border: '#C6C6C8',
  separator: '#E5E5EA',
  
  // Semantic colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
};

// Dark mode colors
export const darkColors = {
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  primary: '#FF6B8A', // Lighter crimson for dark mode
  primaryLight: '#FF8FA8',
  primaryDark: '#DC143C',
  secondary: '#32D74B',
  accent: '#FF9F0A',
  card: '#1C1C1E',
  cardSecondary: '#2C2C2E',
  highlight: '#FFD60A',
  border: '#38383A',
  separator: '#38383A',
  
  // Semantic colors
  success: '#32D74B',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
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
