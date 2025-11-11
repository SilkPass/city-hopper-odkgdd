
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, darkColors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useThemeMode } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');

interface Service {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  category: 'essential' | 'convenience' | 'support';
}

const SERVICES: Service[] = [
  {
    id: 'esim',
    titleKey: 'eSIM',
    descriptionKey: 'stayConnected',
    icon: 'antenna.radiowaves.left.and.right',
    color: '#FF6B6B',
    category: 'essential',
  },
  {
    id: 'payment',
    titleKey: 'payment',
    descriptionKey: 'securePayment',
    icon: 'creditcard.fill',
    color: '#4ECDC4',
    category: 'essential',
  },
  {
    id: 'guide',
    titleKey: 'guide',
    descriptionKey: 'exploreLocal',
    icon: 'book.fill',
    color: '#45B7D1',
    category: 'convenience',
  },
  {
    id: 'emergency',
    titleKey: 'emergency',
    descriptionKey: 'quickEmergency',
    icon: 'phone.fill',
    color: '#FF4757',
    category: 'essential',
  },
  {
    id: 'weather',
    titleKey: 'weatherForecast',
    descriptionKey: 'checkLocalWeather',
    icon: 'cloud.sun.fill',
    color: '#FFA502',
    category: 'convenience',
  },
  {
    id: 'transportation',
    titleKey: 'transportation',
    descriptionKey: 'findNearbyTransit',
    icon: 'car.fill',
    color: '#26DE81',
    category: 'convenience',
  },
  {
    id: 'language',
    titleKey: 'languageAssistant',
    descriptionKey: 'translateEasily',
    icon: 'globe',
    color: '#FD79A8',
    category: 'support',
  },
  {
    id: 'currency',
    titleKey: 'currencyExchange',
    descriptionKey: 'convertCurrency',
    icon: 'dollarsign.circle.fill',
    color: '#A29BFE',
    category: 'convenience',
  },
  {
    id: 'health',
    titleKey: 'healthServices',
    descriptionKey: 'findMedicalHelp',
    icon: 'cross.case.fill',
    color: '#6C5CE7',
    category: 'support',
  },
  {
    id: 'accommodation',
    titleKey: 'accommodation',
    descriptionKey: 'findPlaceToStay',
    icon: 'house.fill',
    color: '#00B894',
    category: 'convenience',
  },
  {
    id: 'dining',
    titleKey: 'dining',
    descriptionKey: 'discoverRestaurants',
    icon: 'fork.knife',
    color: '#FDCB6E',
    category: 'convenience',
  },
  {
    id: 'visa',
    titleKey: 'visaInfo',
    descriptionKey: 'visaRequirements',
    icon: 'doc.text.fill',
    color: '#74B9FF',
    category: 'support',
  },
];

export default function ServicesScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;

  const handleServicePress = (serviceId: string) => {
    console.log('Service pressed:', serviceId);
    // TODO: Navigate to service detail or perform action
  };

  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'essential':
        return t('essentialServices');
      case 'convenience':
        return t('convenienceServices');
      case 'support':
        return t('supportServices');
      default:
        return category;
    }
  };

  const getServicesByCategory = (category: string) => {
    return SERVICES.filter(service => service.category === category);
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: t('services'),
            headerTransparent: false,
            headerStyle: {
              backgroundColor: currentColors.backgroundSecondary,
            },
            headerShadowVisible: false,
            headerLargeTitle: true,
          }}
        />
      )}
      
      <SafeAreaView 
        style={[styles.container, { backgroundColor: currentColors.background }]}
        edges={['bottom']}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          {Platform.OS === 'android' && (
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: currentColors.text }]}>
                {t('services')}
              </Text>
              <Text style={[styles.headerSubtitle, { color: currentColors.textSecondary }]}>
                {t('servicesDescription')}
              </Text>
            </View>
          )}

          {/* Essential Services */}
          <View style={styles.categorySection}>
            <Text style={[styles.categoryTitle, { color: currentColors.text }]}>
              {getCategoryTitle('essential')}
            </Text>
            <View style={styles.servicesGrid}>
              {getServicesByCategory('essential').map((service) => (
                <Pressable
                  key={service.id}
                  style={[styles.serviceCard, { backgroundColor: currentColors.backgroundSecondary }]}
                  onPress={() => handleServicePress(service.id)}
                >
                  <View style={[styles.serviceIconContainer, { backgroundColor: service.color + '15' }]}>
                    <IconSymbol name={service.icon} color={service.color} size={32} />
                  </View>
                  <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                    {t(service.titleKey)}
                  </Text>
                  <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                    {t(service.descriptionKey)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Convenience Services */}
          <View style={styles.categorySection}>
            <Text style={[styles.categoryTitle, { color: currentColors.text }]}>
              {getCategoryTitle('convenience')}
            </Text>
            <View style={styles.servicesGrid}>
              {getServicesByCategory('convenience').map((service) => (
                <Pressable
                  key={service.id}
                  style={[styles.serviceCard, { backgroundColor: currentColors.backgroundSecondary }]}
                  onPress={() => handleServicePress(service.id)}
                >
                  <View style={[styles.serviceIconContainer, { backgroundColor: service.color + '15' }]}>
                    <IconSymbol name={service.icon} color={service.color} size={32} />
                  </View>
                  <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                    {t(service.titleKey)}
                  </Text>
                  <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                    {t(service.descriptionKey)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Support Services */}
          <View style={[styles.categorySection, { paddingBottom: Platform.OS === 'android' ? 100 : 20 }]}>
            <Text style={[styles.categoryTitle, { color: currentColors.text }]}>
              {getCategoryTitle('support')}
            </Text>
            <View style={styles.servicesGrid}>
              {getServicesByCategory('support').map((service) => (
                <Pressable
                  key={service.id}
                  style={[styles.serviceCard, { backgroundColor: currentColors.backgroundSecondary }]}
                  onPress={() => handleServicePress(service.id)}
                >
                  <View style={[styles.serviceIconContainer, { backgroundColor: service.color + '15' }]}>
                    <IconSymbol name={service.icon} color={service.color} size={32} />
                  </View>
                  <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                    {t(service.titleKey)}
                  </Text>
                  <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                    {t(service.descriptionKey)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  serviceDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
});
