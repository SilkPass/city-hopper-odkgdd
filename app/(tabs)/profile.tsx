
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import React from "react";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.profilePicture}>
              <IconSymbol name="person.fill" size={60} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.username}>@Jerry</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: colors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="person.fill" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </View>
          </GlassView>

          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: colors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="bell.fill" size={24} color={colors.secondary} />
              <Text style={styles.menuItemText}>Notifications</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </View>
          </GlassView>

          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: colors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="lock.fill" size={24} color={colors.accent} />
              <Text style={styles.menuItemText}>Privacy & Security</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </View>
          </GlassView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: colors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="globe" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Language</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </View>
          </GlassView>

          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: colors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="moon.fill" size={24} color={colors.accent} />
              <Text style={styles.menuItemText}>Dark Mode</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </View>
          </GlassView>
        </View>

        <View style={[styles.section, { paddingBottom: Platform.OS === 'android' ? 100 : 20 }]}>
          <GlassView 
            style={[
              styles.card,
              Platform.OS !== 'ios' && { backgroundColor: colors.card }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.menuItem}>
              <IconSymbol name="arrow.right.square.fill" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Sign Out</Text>
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    color: colors.text,
  },
});
