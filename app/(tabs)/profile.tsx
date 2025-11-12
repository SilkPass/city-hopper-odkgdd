
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Modal, Dimensions } from "react-native";
import React, { useState } from "react";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, darkColors } from "@/styles/commonStyles";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

type SupportedLanguage = 'en' | 'mn' | 'ru' | 'kk' | 'uz' | 'uk' | 'fa';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монголоор' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
];

export default function ProfileScreen() {
  const theme = useTheme();
  const { isDark, themeMode, setThemeMode } = useThemeMode();
  const { t, language, setLanguage } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleMenuPress = (item: string) => {
    console.log('Menu item pressed:', item);
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const handleThemePress = () => {
    setShowThemeModal(true);
  };

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    console.log('Switching language to:', langCode);
    setLanguage(langCode);
    setShowLanguageModal(false);
  };

  const handleThemeSelect = (mode: 'light' | 'dark' | 'auto') => {
    console.log('Switching theme to:', mode);
    setThemeMode(mode);
    setShowThemeModal(false);
  };

  const getCurrentLanguageName = () => {
    const currentLang = LANGUAGE_OPTIONS.find(lang => lang.code === language);
    return currentLang ? currentLang.nativeName : 'English';
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return t('lightTheme') || 'Light';
      case 'dark':
        return t('darkTheme') || 'Dark';
      case 'auto':
        return t('autoTheme') || 'Auto';
      default:
        return 'Auto';
    }
  };

  const horizontalPadding = isTablet ? 40 : 16;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={[styles.profilePicture, { backgroundColor: currentColors.primary, width: isTablet ? 120 : 100, height: isTablet ? 120 : 100, borderRadius: isTablet ? 60 : 50 }]}>
              <IconSymbol name="person.fill" size={isTablet ? 72 : 60} color="#FFFFFF" />
            </View>
          </View>
          <Text style={[styles.username, { color: currentColors.text, fontSize: isTablet ? 28 : 24 }]}>Jerry Chen</Text>
          <Text style={[styles.email, { color: currentColors.textSecondary, fontSize: isTablet ? 18 : 15 }]}>jerry@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text, fontSize: isTablet ? 22 : 18 }]}>
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
                <View style={[styles.iconContainer, { backgroundColor: currentColors.primary + '15', width: isTablet ? 44 : 36, height: isTablet ? 44 : 36, borderRadius: isTablet ? 22 : 18 }]}>
                  <IconSymbol name="person.fill" size={isTablet ? 24 : 20} color={currentColors.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text, fontSize: isTablet ? 19 : 16 }]}>
                  {t('editProfile')}
                </Text>
                <IconSymbol name="chevron.right" size={isTablet ? 24 : 20} color={currentColors.textSecondary} />
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
                <View style={[styles.iconContainer, { backgroundColor: currentColors.info + '15', width: isTablet ? 44 : 36, height: isTablet ? 44 : 36, borderRadius: isTablet ? 22 : 18 }]}>
                  <IconSymbol name="bell.fill" size={isTablet ? 24 : 20} color={currentColors.info} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text, fontSize: isTablet ? 19 : 16 }]}>
                  {t('notifications')}
                </Text>
                <IconSymbol name="chevron.right" size={isTablet ? 24 : 20} color={currentColors.textSecondary} />
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
                <View style={[styles.iconContainer, { backgroundColor: currentColors.accent + '15', width: isTablet ? 44 : 36, height: isTablet ? 44 : 36, borderRadius: isTablet ? 22 : 18 }]}>
                  <IconSymbol name="lock.fill" size={isTablet ? 24 : 20} color={currentColors.accent} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text, fontSize: isTablet ? 19 : 16 }]}>
                  {t('privacySecurity')}
                </Text>
                <IconSymbol name="chevron.right" size={isTablet ? 24 : 20} color={currentColors.textSecondary} />
              </View>
            </GlassView>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text, fontSize: isTablet ? 22 : 18 }]}>
            {t('preferences')}
          </Text>

          <Pressable onPress={handleThemePress}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.warning + '15', width: isTablet ? 44 : 36, height: isTablet ? 44 : 36, borderRadius: isTablet ? 22 : 18 }]}>
                  <IconSymbol name="moon.fill" size={isTablet ? 24 : 20} color={currentColors.warning} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text, fontSize: isTablet ? 19 : 16 }]}>
                  {t('theme') || 'Theme'}
                </Text>
                <View style={[styles.badge, { backgroundColor: currentColors.primary + '15' }]}>
                  <Text style={[styles.badgeText, { color: currentColors.primary, fontSize: isTablet ? 15 : 13 }]}>
                    {getThemeLabel()}
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={isTablet ? 24 : 20} color={currentColors.textSecondary} />
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
                <View style={[styles.iconContainer, { backgroundColor: currentColors.success + '15', width: isTablet ? 44 : 36, height: isTablet ? 44 : 36, borderRadius: isTablet ? 22 : 18 }]}>
                  <IconSymbol name="globe" size={isTablet ? 24 : 20} color={currentColors.success} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.text, fontSize: isTablet ? 19 : 16 }]}>
                  {t('language')}
                </Text>
                <View style={[styles.languageBadge, { backgroundColor: currentColors.primary + '15' }]}>
                  <Text style={[styles.languageBadgeText, { color: currentColors.primary, fontSize: isTablet ? 15 : 13 }]}>
                    {getCurrentLanguageName()}
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={isTablet ? 24 : 20} color={currentColors.textSecondary} />
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
                <View style={[styles.iconContainer, { backgroundColor: currentColors.error + '15', width: isTablet ? 44 : 36, height: isTablet ? 44 : 36, borderRadius: isTablet ? 22 : 18 }]}>
                  <IconSymbol name="arrow.right.square.fill" size={isTablet ? 24 : 20} color={currentColors.error} />
                </View>
                <Text style={[styles.menuItemText, { color: currentColors.error, fontSize: isTablet ? 19 : 16 }]}>
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
              <IconSymbol name="xmark" color={currentColors.textSecondary} size={isTablet ? 28 : 24} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
              {t('language')}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Language Options */}
          <ScrollView 
            style={styles.languageList}
            contentContainerStyle={[styles.languageContent, { paddingHorizontal: isTablet ? 40 : 16 }]}
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
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageName, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={[styles.languageEnglishName, { color: currentColors.textSecondary, fontSize: isTablet ? 17 : 14 }]}>
                    {lang.name}
                  </Text>
                </View>
                {language === lang.code && (
                  <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={isTablet ? 36 : 28} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <SafeAreaView 
          style={[styles.modalContainer, { backgroundColor: currentColors.background }]} 
          edges={['top', 'bottom']}
        >
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: currentColors.separator }]}>
            <Pressable onPress={() => setShowThemeModal(false)} style={styles.backButton}>
              <IconSymbol name="xmark" color={currentColors.textSecondary} size={isTablet ? 28 : 24} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
              {t('theme') || 'Theme'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Theme Options */}
          <ScrollView 
            style={styles.languageList}
            contentContainerStyle={[styles.languageContent, { paddingHorizontal: isTablet ? 40 : 16 }]}
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              style={[
                styles.themeCard, 
                { 
                  backgroundColor: currentColors.backgroundSecondary,
                  borderColor: themeMode === 'auto' ? currentColors.primary : 'transparent',
                  borderWidth: themeMode === 'auto' ? 2 : 0,
                }
              ]}
              onPress={() => handleThemeSelect('auto')}
            >
              <View style={[styles.themeIconContainer, { backgroundColor: currentColors.warning + '15', width: isTablet ? 80 : 64, height: isTablet ? 80 : 64, borderRadius: isTablet ? 40 : 32 }]}>
                <IconSymbol name="moon.stars.fill" size={isTablet ? 40 : 32} color={currentColors.warning} />
              </View>
              <View style={styles.themeInfo}>
                <Text style={[styles.themeName, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
                  {t('autoTheme') || 'Auto'}
                </Text>
                <Text style={[styles.themeDescription, { color: currentColors.textSecondary, fontSize: isTablet ? 17 : 14 }]}>
                  {t('autoThemeDescription') || 'Light during day, dark at night'}
                </Text>
              </View>
              {themeMode === 'auto' && (
                <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={isTablet ? 36 : 28} />
              )}
            </Pressable>

            <Pressable
              style={[
                styles.themeCard, 
                { 
                  backgroundColor: currentColors.backgroundSecondary,
                  borderColor: themeMode === 'light' ? currentColors.primary : 'transparent',
                  borderWidth: themeMode === 'light' ? 2 : 0,
                }
              ]}
              onPress={() => handleThemeSelect('light')}
            >
              <View style={[styles.themeIconContainer, { backgroundColor: '#FFD700' + '15', width: isTablet ? 80 : 64, height: isTablet ? 80 : 64, borderRadius: isTablet ? 40 : 32 }]}>
                <IconSymbol name="sun.max.fill" size={isTablet ? 40 : 32} color="#FFD700" />
              </View>
              <View style={styles.themeInfo}>
                <Text style={[styles.themeName, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
                  {t('lightTheme') || 'Light'}
                </Text>
                <Text style={[styles.themeDescription, { color: currentColors.textSecondary, fontSize: isTablet ? 17 : 14 }]}>
                  {t('lightThemeDescription') || 'Always use light theme'}
                </Text>
              </View>
              {themeMode === 'light' && (
                <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={isTablet ? 36 : 28} />
              )}
            </Pressable>

            <Pressable
              style={[
                styles.themeCard, 
                { 
                  backgroundColor: currentColors.backgroundSecondary,
                  borderColor: themeMode === 'dark' ? currentColors.primary : 'transparent',
                  borderWidth: themeMode === 'dark' ? 2 : 0,
                }
              ]}
              onPress={() => handleThemeSelect('dark')}
            >
              <View style={[styles.themeIconContainer, { backgroundColor: '#4A5568' + '15', width: isTablet ? 80 : 64, height: isTablet ? 80 : 64, borderRadius: isTablet ? 40 : 32 }]}>
                <IconSymbol name="moon.fill" size={isTablet ? 40 : 32} color="#4A5568" />
              </View>
              <View style={styles.themeInfo}>
                <Text style={[styles.themeName, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
                  {t('darkTheme') || 'Dark'}
                </Text>
                <Text style={[styles.themeDescription, { color: currentColors.textSecondary, fontSize: isTablet ? 17 : 14 }]}>
                  {t('darkThemeDescription') || 'Always use dark theme'}
                </Text>
              </View>
              {themeMode === 'dark' && (
                <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={isTablet ? 36 : 28} />
              )}
            </Pressable>
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
  scrollContent: {},
  header: {
    alignItems: 'center',
    paddingVertical: isTablet ? 40 : 32,
  },
  avatarContainer: {
    marginBottom: isTablet ? 20 : 16,
  },
  profilePicture: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  username: {
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  email: {
    fontWeight: '400',
  },
  section: {
    marginBottom: isTablet ? 32 : 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: isTablet ? 16 : 12,
    paddingHorizontal: 4,
    letterSpacing: -0.3,
  },
  card: {
    borderRadius: isTablet ? 16 : 12,
    marginBottom: isTablet ? 12 : 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: isTablet ? 12 : 10,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: isTablet ? 14 : 12,
  },
  badgeText: {
    fontWeight: '600',
  },
  languageBadge: {
    paddingHorizontal: isTablet ? 12 : 10,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: isTablet ? 14 : 12,
    marginRight: 4,
  },
  languageBadgeText: {
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  modalTitle: {
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
    paddingVertical: isTablet ? 24 : 16,
    paddingBottom: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
    borderRadius: isTablet ? 20 : 16,
    marginBottom: isTablet ? 16 : 12,
    gap: isTablet ? 16 : 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  languageEnglishName: {
    fontWeight: '500',
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
    borderRadius: isTablet ? 20 : 16,
    marginBottom: isTablet ? 16 : 12,
    gap: isTablet ? 16 : 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  themeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  themeDescription: {
    fontWeight: '500',
  },
});
