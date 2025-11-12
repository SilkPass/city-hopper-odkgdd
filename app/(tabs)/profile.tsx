
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Modal } from "react-native";
import React, { useState } from "react";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, darkColors } from "@/styles/commonStyles";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

type SupportedLanguage = 'en' | 'mn' | 'ru' | 'kk' | 'uz';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монголоор', flag: '🇲🇳' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

export default function ProfileScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t, language, setLanguage } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleMenuPress = (item: string) => {
    console.log('Menu item pressed:', item);
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    console.log('Switching language to:', langCode);
    setLanguage(langCode);
    setShowLanguageModal(false);
  };

  const getCurrentLanguageName = () => {
    const currentLang = LANGUAGE_OPTIONS.find(lang => lang.code === language);
    return currentLang ? `${currentLang.flag} ${currentLang.nativeName}` : 'English';
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

          <Pressable onPress={handleLanguagePress}>
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
                <View style={[styles.languageBadge, { backgroundColor: currentColors.primary + '15' }]}>
                  <Text style={[styles.languageBadgeText, { color: currentColors.primary }]}>
                    {getCurrentLanguageName()}
                  </Text>
                </View>
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

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <SafeAreaView 
          style={[styles.modalContainer, { backgroundColor: currentColors.background }]} 
          edges={['top', 'bottom']}
        >
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: currentColors.separator }]}>
            <Pressable onPress={() => setShowLanguageModal(false)} style={styles.backButton}>
              <IconSymbol name="xmark" color={currentColors.textSecondary} size={24} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              {t('language')}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Language Options */}
          <ScrollView 
            style={styles.languageList}
            contentContainerStyle={styles.languageContent}
            showsVerticalScrollIndicator={false}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <Pressable
                key={lang.code}
                style={[
                  styles.languageCard, 
                  { 
                    backgroundColor: currentColors.backgroundSecondary,
                    borderColor: language === lang.code ? currentColors.primary : 'transparent',
                    borderWidth: language === lang.code ? 2 : 0,
                  }
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <View style={styles.languageFlag}>
                  <Text style={styles.flagEmoji}>{lang.flag}</Text>
                </View>
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageName, { color: currentColors.text }]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={[styles.languageEnglishName, { color: currentColors.textSecondary }]}>
                    {lang.name}
                  </Text>
                </View>
                {language === lang.code && (
                  <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={28} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  languageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  languageBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  languageList: {
    flex: 1,
  },
  languageContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  languageFlag: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  flagEmoji: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  languageEnglishName: {
    fontSize: 14,
    fontWeight: '500',
  },
});
