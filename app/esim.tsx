
import { IconSymbol } from '@/components/IconSymbol';
import { colors, darkColors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useThemeMode } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function ESimScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const currentColors = isDark ? darkColors : colors;

  const handlePurchase = (plan: DataPlan) => {
    Alert.alert(
      t('confirmPurchase'),
      `${plan.days} ${t('days')} ${plan.data} GB - ¥${plan.price}`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => console.log('Purchase confirmed') },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: t('getESim'),
          headerShown: true,
          headerStyle: {
            backgroundColor: currentColors.background,
          },
          headerTintColor: currentColors.text,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={currentColors.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {t('chinaMainlandMacau')}
        </Text>
        <View style={styles.plansGrid}>
          {DATA_PLANS.map((plan, index) => (
            <View key={plan.id} style={styles.planCardWrapper}>
              <View style={[styles.planCard, { backgroundColor: currentColors.card }]}>
                <View style={styles.planInfo}>
                  <Text style={[styles.planDays, { color: currentColors.text }]}>
                    {plan.days} {t('days')}
                  </Text>
                  <Text style={[styles.planData, { color: currentColors.primary }]}>
                    {plan.data} GB
                  </Text>
                  <Text style={[styles.planPrice, { color: currentColors.text }]}>
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
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: Platform.OS === 'ios' ? 0 : 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  planCardWrapper: {
    width: '48%',
    marginBottom: 4,
  },
  planCard: {
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  planInfo: {
    marginBottom: 16,
  },
  planDays: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  planData: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  purchaseButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
