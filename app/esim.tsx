
import { useLanguage } from '@/contexts/LanguageContext';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, darkColors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useThemeMode } from '@/contexts/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';

interface DataPlan {
  id: string;
  days: number;
  data: number;
  price: number;
}

const DATA_PLANS: DataPlan[] = [
  { id: '1', days: 2, data: 3, price: 29 },
  { id: '2', days: 5, data: 7, price: 59 },
  { id: '3', days: 8, data: 9, price: 79 },
  { id: '4', days: 30, data: 17, price: 199 },
];

const { width } = Dimensions.get('window');

export default function ESimScreen() {
  const { t } = useLanguage();
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const router = useRouter();
  const currentColors = isDark ? darkColors : colors;

  const handlePurchase = (plan: DataPlan) => {
    Alert.alert(
      t('purchaseConfirm'),
      `${plan.days}${t('days')} ${plan.data}GB - ¥${plan.price}`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => console.log('Purchase:', plan) }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('getESim'),
          headerStyle: {
            backgroundColor: currentColors.background,
          },
          headerTintColor: currentColors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow-back"
                size={24}
                color={currentColors.text}
              />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
          {t('chinaMainlandMacau')}
        </Text>

        {DATA_PLANS.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              {
                backgroundColor: currentColors.cardBackground,
                borderColor: currentColors.border,
              },
            ]}
          >
            <View style={styles.planInfo}>
              <Text style={[styles.planTitle, { color: currentColors.text }]}>
                {plan.days} {t('days')} {plan.data} GB
              </Text>
              <Text style={[styles.planPrice, { color: currentColors.primary }]}>
                ¥{plan.price}
              </Text>
            </View>
            
            <Pressable
              style={[styles.purchaseButton, { backgroundColor: currentColors.primary }]}
              onPress={() => handlePurchase(plan)}
            >
              <Text style={styles.purchaseButtonText}>{t('purchase')}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: Platform.OS === 'ios' ? 0 : 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  planInfo: {
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  purchaseButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
