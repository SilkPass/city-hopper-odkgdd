
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import React from "react";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, darkColors } from "@/styles/commonStyles";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfileScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;

  const handleMenuPress = (item: string) => {
    console.log('Menu item pressed:', item);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={[styles.profilePicture, { backgroundColor: currentColors.primary }]}>
              <IconSymbol name="person.fill" size={60} color="#FFFFFF" />
            </View>
          </View>
          <Text style={[styles.username, { color: currentColors.text }]}>Jerry Chen</Text>
          <Text style={[styles.email, { color: currentColors.textSecondary }]}>jerry@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('accountSettings')}
          </Text>
          
          <Pressable onPress={() => handleMenuPress('Edit Profile')}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.primary + '15' }]}>
                  <IconSymbol name="person.fill" size={20} color={currentColors.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                  {t('editProfile')}
                </Text>
                <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
              </View>
            </GlassView>
          </Pressable>

          <Pressable onPress={() => handleMenuPress('Notifications')}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.info + '15' }]}>
                  <IconSymbol name="bell.fill" size={20} color={currentColors.info} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                  {t('notifications')}
                </Text>
                <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
              </View>
            </GlassView>
          </Pressable>

          <Pressable onPress={() => handleMenuPress('Privacy & Security')}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.accent + '15' }]}>
                  <IconSymbol name="lock.fill" size={20} color={currentColors.accent} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                  {t('privacySecurity')}
                </Text>
                <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
              </View>
            </GlassView>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('preferences')}
          </Text>

          <Pressable onPress={() => handleMenuPress('Dark Mode')}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.warning + '15' }]}>
                  <IconSymbol name="moon.fill" size={20} color={currentColors.warning} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                  {t('darkMode')}
                </Text>
                <View style={[styles.badge, { backgroundColor: isDark ? currentColors.primary : currentColors.separator }]}>
                  <Text style={[styles.badgeText, { color: isDark ? '#FFFFFF' : currentColors.textSecondary }]}>
                    {isDark ? 'On' : 'Off'}
                  </Text>
                </View>
              </View>
            </GlassView>
          </Pressable>

          <Pressable onPress={() => handleMenuPress('Language')}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.success + '15' }]}>
                  <IconSymbol name="globe" size={20} color={currentColors.success} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                  {t('language')}
                </Text>
                <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
              </View>
            </GlassView>
          </Pressable>
        </View>

        <View style={[styles.section, { paddingBottom: Platform.OS === 'android' ? 100 : 20 }]}>
          <Pressable onPress={() => handleMenuPress('Sign Out')}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.error + '15' }]}>
                  <IconSymbol name="arrow.right.square.fill" size={20} color={currentColors.error} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.error }]}>
                  {t('signOut')}
                </Text>
              </View>
            </GlassView>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 15,
    fontWeight: '400',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
    letterSpacing: -0.3,
  },
  card: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
