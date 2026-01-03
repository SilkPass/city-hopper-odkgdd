
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
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, darkColors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePurchase = (plan: DataPlan) => {
    console.log('Purchase button pressed for plan:', plan);
    // TODO: Backend Integration - Call the payment API endpoint here to process the eSIM purchase
    Alert.alert(
      t('confirmPurchase') || '确认购买',
      `${plan.days} ${t('days') || '日'} ${plan.data} GB - ¥${plan.price}`,
      [
        { text: t('cancel') || '取消', style: 'cancel' },
        { 
          text: t('purchase') || '购买', 
          onPress: () => {
            console.log('Purchase confirmed:', plan);
            Alert.alert(
              t('success') || '成功',
              t('purchaseSuccess') || '购买成功！',
              [{ text: t('ok') || '好的' }]
            );
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Get eSIM',
          headerBackTitle: t('back') || '返回',
          headerStyle: {
            backgroundColor: currentColors.background,
          },
          headerTintColor: currentColors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            name="antenna.radiowaves.left.and.right" 
            color={currentColors.primary} 
            size={isTablet ? 72 : 56} 
          />
          <Text style={[styles.title, { color: currentColors.text }]}>
            {t('chinaMainlandMacau') || '中国内地及澳门'}
          </Text>
          <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
            {t('selectDataPlan') || '选择您的数据套餐'}
          </Text>
        </View>

        {DATA_PLANS.map((plan) => (
          <Pressable
            key={plan.id}
            style={[
              styles.planCard,
              { 
                backgroundColor: currentColors.backgroundSecondary,
                borderColor: selectedPlan === plan.id ? currentColors.primary : currentColors.border,
              }
            ]}
            onPress={() => {
              console.log('Plan selected:', plan);
              setSelectedPlan(plan.id);
            }}
          >
            <View style={styles.planHeader}>
              <View style={[styles.iconContainer, { backgroundColor: currentColors.primary + '15' }]}>
                <IconSymbol 
                  ios_icon_name="wifi" 
                  android_material_icon_name="wifi" 
                  size={isTablet ? 32 : 24} 
                  color={currentColors.primary} 
                />
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planTitle, { color: currentColors.text }]}>
                  {plan.days} {t('days') || '日'} {plan.data} GB
                </Text>
                <Text style={[styles.planSubtitle, { color: currentColors.textSecondary }]}>
                  {t('dataValidity') || '数据有效期'}
                </Text>
              </View>
            </View>
            
            <View style={styles.planPricing}>
              <View style={styles.priceContainer}>
                <Text style={[styles.currency, { color: currentColors.textSecondary }]}>¥</Text>
                <Text style={[styles.planPrice, { color: currentColors.primary }]}>{plan.price}</Text>
              </View>
              
              <Pressable
                style={[
                  styles.purchaseButton,
                  { backgroundColor: currentColors.primary }
                ]}
                onPress={() => handlePurchase(plan)}
              >
                <Text style={styles.purchaseButtonText}>
                  {t('purchase') || '购买'}
                </Text>
                <IconSymbol 
                  ios_icon_name="arrow.right" 
                  android_material_icon_name="arrow-forward" 
                  size={18} 
                  color="#FFFFFF" 
                />
              </Pressable>
            </View>

            {selectedPlan === plan.id && (
              <View style={[styles.selectedBadge, { backgroundColor: currentColors.primary }]}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={16} 
                  color="#FFFFFF" 
                />
              </View>
            )}
          </Pressable>
        ))}

        <View style={[styles.infoCard, { backgroundColor: currentColors.cardSecondary }]}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={currentColors.info} 
          />
          <Text style={[styles.infoText, { color: currentColors.textSecondary }]}>
            {t('esimInfo') || 'eSIM 将在购买后立即激活。请确保您的设备支持 eSIM 功能。'}
          </Text>
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
  content: {
    padding: isTablet ? 32 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: isTablet ? 40 : 32,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    marginTop: isTablet ? 20 : 16,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  planCard: {
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 24 : 20,
    marginBottom: isTablet ? 20 : 16,
    borderWidth: 2,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
  },
  iconContainer: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  planSubtitle: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '500',
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currency: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: isTablet ? 40 : 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: isTablet ? 16 : 14,
    paddingHorizontal: isTablet ? 28 : 24,
    borderRadius: isTablet ? 14 : 12,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  selectedBadge: {
    position: 'absolute',
    top: isTablet ? 16 : 12,
    right: isTablet ? 16 : 12,
    width: isTablet ? 32 : 28,
    height: isTablet ? 32 : 28,
    borderRadius: isTablet ? 16 : 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: isTablet ? 16 : 12,
    padding: isTablet ? 20 : 16,
    borderRadius: isTablet ? 16 : 12,
    marginTop: isTablet ? 12 : 8,
  },
  infoText: {
    flex: 1,
    fontSize: isTablet ? 15 : 14,
    lineHeight: isTablet ? 22 : 20,
    fontWeight: '500',
  },
});
