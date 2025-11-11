
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
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
          <Text style={[styles.username, { color: currentColors.text }]}>@Jerry</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('accountSettings')}
          </Text>
          
          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="person.fill" size={24} color={currentColors.primary} />
              <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                {t('editProfile')}
              </Text>
              <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
            </View>
          </GlassView>

          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="bell.fill" size={24} color={currentColors.secondary} />
              <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                {t('notifications')}
              </Text>
              <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
            </View>
          </GlassView>

          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="lock.fill" size={24} color={currentColors.accent} />
              <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                {t('privacySecurity')}
              </Text>
              <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
            </View>
          </GlassView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('preferences')}
          </Text>

          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="moon.fill" size={24} color={currentColors.accent} />
              <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                {t('darkMode')}
              </Text>
              <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
            </View>
          </GlassView>
        </View>

        <View style={[styles.section, { paddingBottom: Platform.OS === 'android' ? 100 : 20 }]}>
          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="arrow.right.square.fill" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>
                {t('signOut')}
              </Text>
            </View>
          </GlassView>
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
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
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
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
