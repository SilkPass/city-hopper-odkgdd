
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Modal } from "react-native";
import React, { useState } from "react";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, darkColors } from "@/styles/commonStyles";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useLanguage, SupportedLanguage } from "@/contexts/LanguageContext";

export default function ProfileScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t, language, setLanguage } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const languages: { code: SupportedLanguage; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
    { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
    { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha' },
  ];

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setShowLanguageModal(false);
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
          
          <Pressable onPress={() => setShowLanguageModal(true)}>
            <GlassView 
              style={[
                styles.card,
                Platform.OS !== 'ios' && { backgroundColor: currentColors.card }
              ]} 
              glassEffectStyle="regular"
            >
              <View style={styles.menuItem}>
                <IconSymbol name="globe" size={24} color={currentColors.primary} />
                <Text style={[styles.menuItemText, { color: currentColors.text }]}>
                  {t('language')}
                </Text>
                <View style={styles.languageValueContainer}>
                  <Text style={[styles.languageValue, { color: currentColors.textSecondary }]}>
                    {languages.find(l => l.code === language)?.nativeName}
                  </Text>
                  <IconSymbol name="chevron.right" size={20} color={currentColors.textSecondary} />
                </View>
              </View>
            </GlassView>
          </Pressable>

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

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: currentColors.overlay }]}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: currentColors.backgroundSecondary }]}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.modalHandle, { backgroundColor: currentColors.separator }]} />
              
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: currentColors.text }]}>
                  {t('selectLanguage')}
                </Text>
                <Pressable 
                  onPress={() => setShowLanguageModal(false)}
                  style={styles.modalCloseButton}
                >
                  <IconSymbol name="xmark.circle.fill" color={currentColors.textSecondary} size={28} />
                </Pressable>
              </View>
              
              <View style={styles.languageList}>
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  
                  return (
                    <Pressable
                      key={lang.code}
                      style={[
                        styles.languageItem,
                        { backgroundColor: currentColors.cardSecondary },
                        isSelected && { backgroundColor: currentColors.primary + '15' }
                      ]}
                      onPress={() => handleLanguageSelect(lang.code)}
                    >
                      <View style={styles.languageItemLeft}>
                        <View style={[
                          styles.languageIconContainer,
                          { backgroundColor: currentColors.separator },
                          isSelected && { backgroundColor: currentColors.primary + '20' }
                        ]}>
                          <IconSymbol 
                            name="globe" 
                            color={isSelected ? currentColors.primary : currentColors.textSecondary} 
                            size={18} 
                          />
                        </View>
                        <View>
                          <Text style={[
                            styles.languageItemText,
                            { color: currentColors.text },
                            isSelected && { color: currentColors.primary }
                          ]}>
                            {lang.nativeName}
                          </Text>
                          <Text style={[styles.languageItemSubtext, { color: currentColors.textSecondary }]}>
                            {lang.name}
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={24} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </View>
        </Pressable>
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
  languageValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  modalCloseButton: {
    padding: 4,
  },
  languageList: {
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  languageIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageItemText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  languageItemSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
});
