
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, darkColors } from '@/styles/commonStyles';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Stack, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface EmergencyNumber {
  id: string;
  number: string;
  titleKey: string;
  color: string;
}

const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: 'police',
    number: '110',
    titleKey: 'policeEmergency',
    color: '#3498DB',
  },
  {
    id: 'ambulance',
    number: '120',
    titleKey: 'ambulanceEmergency',
    color: '#E74C3C',
  },
  {
    id: 'fire',
    number: '119',
    titleKey: 'fireEmergency',
    color: '#E67E22',
  },
];

export default function EmergencyScreen() {
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const router = useRouter();
  const currentColors = isDark ? darkColors : colors;

  const handleCall = (number: string) => {
    console.log('Calling emergency number:', number);
    const phoneUrl = `tel:${number}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          console.log('Phone calls not supported on this device');
        }
      })
      .catch((err) => console.error('Error opening phone dialer:', err));
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: t('emergencyNumbers'),
            headerTransparent: false,
            headerStyle: {
              backgroundColor: currentColors.backgroundSecondary,
            },
            headerShadowVisible: false,
            headerLargeTitle: true,
            headerBackTitle: t('services'),
          }}
        />
      )}
      
      <SafeAreaView 
        style={[styles.container, { backgroundColor: currentColors.background }]}
        edges={['bottom']}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: isTablet ? 40 : 20 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header for Android */}
          {Platform.OS === 'android' && (
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <IconSymbol
                  name="arrow.left"
                  size={24}
                  color={currentColors.text}
                />
              </Pressable>
              <Text style={[styles.headerTitle, { color: currentColors.text, fontSize: isTablet ? 42 : 34 }]}>
                {t('emergencyNumbers')}
              </Text>
              <Text style={[styles.headerSubtitle, { color: currentColors.textSecondary, fontSize: isTablet ? 20 : 17 }]}>
                {t('emergencyNumbersDesc')}
              </Text>
            </View>
          )}

          {/* Warning Banner */}
          <View style={[styles.warningBanner, { backgroundColor: '#FFF3CD', borderColor: '#FFC107' }]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={isTablet ? 32 : 24} color="#856404" />
            <Text style={[styles.warningText, { fontSize: isTablet ? 18 : 15 }]}>
              {t('emergencyWarning')}
            </Text>
          </View>

          {/* Emergency Numbers - Flattened Cards */}
          <View style={styles.numbersSection}>
            {EMERGENCY_NUMBERS.map((emergency, index) => (
              <React.Fragment key={emergency.id}>
                <Pressable
                  style={[
                    styles.emergencyCard,
                    { 
                      backgroundColor: currentColors.backgroundSecondary,
                      borderLeftWidth: 4,
                      borderLeftColor: emergency.color,
                    }
                  ]}
                  onPress={() => handleCall(emergency.number)}
                >
                  <View style={styles.emergencyCardContent}>
                    <View style={styles.emergencyInfo}>
                      <Text style={[styles.emergencyTitle, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
                        {t(emergency.titleKey)}
                      </Text>
                      <Text style={[styles.emergencyNumber, { color: emergency.color, fontSize: isTablet ? 48 : 40 }]}>
                        {emergency.number}
                      </Text>
                    </View>
                    <View style={[styles.callButton, { backgroundColor: emergency.color }]}>
                      <IconSymbol name="phone.fill" size={isTablet ? 28 : 24} color="#FFFFFF" />
                    </View>
                  </View>
                </Pressable>
              </React.Fragment>
            ))}
          </View>

          {/* Additional Information */}
          <View style={[styles.infoSection, { backgroundColor: currentColors.backgroundSecondary }]}>
            <Text style={[styles.infoTitle, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
              {t('importantInfo')}
            </Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <IconSymbol name="checkmark.circle.fill" size={isTablet ? 28 : 24} color="#27AE60" />
                <Text style={[styles.infoText, { color: currentColors.textSecondary, fontSize: isTablet ? 18 : 15 }]}>
                  {t('emergencyInfo1')}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <IconSymbol name="checkmark.circle.fill" size={isTablet ? 28 : 24} color="#27AE60" />
                <Text style={[styles.infoText, { color: currentColors.textSecondary, fontSize: isTablet ? 18 : 15 }]}>
                  {t('emergencyInfo2')}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <IconSymbol name="checkmark.circle.fill" size={isTablet ? 28 : 24} color="#27AE60" />
                <Text style={[styles.infoText, { color: currentColors.textSecondary, fontSize: isTablet ? 18 : 15 }]}>
                  {t('emergencyInfo3')}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom padding for tab bar */}
          <View style={{ height: Platform.OS === 'android' ? 100 : 20 }} />
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
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  header: {
    marginBottom: isTablet ? 32 : 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontWeight: '400',
    lineHeight: isTablet ? 28 : 24,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 24 : 16,
    borderRadius: isTablet ? 20 : 16,
    borderWidth: 2,
    marginBottom: isTablet ? 32 : 24,
    gap: isTablet ? 16 : 12,
  },
  warningText: {
    flex: 1,
    color: '#856404',
    fontWeight: '600',
    lineHeight: isTablet ? 26 : 22,
  },
  numbersSection: {
    gap: isTablet ? 16 : 12,
    marginBottom: isTablet ? 32 : 24,
  },
  emergencyCard: {
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 24 : 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  emergencyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isTablet ? 20 : 16,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    fontWeight: '600',
    marginBottom: isTablet ? 8 : 6,
    letterSpacing: -0.3,
  },
  emergencyNumber: {
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  callButton: {
    width: isTablet ? 64 : 56,
    height: isTablet ? 64 : 56,
    borderRadius: isTablet ? 32 : 28,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  infoSection: {
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 32 : 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  infoTitle: {
    fontWeight: '700',
    marginBottom: isTablet ? 24 : 20,
    letterSpacing: -0.5,
  },
  infoList: {
    gap: isTablet ? 20 : 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: isTablet ? 16 : 12,
  },
  infoText: {
    flex: 1,
    lineHeight: isTablet ? 26 : 22,
    fontWeight: '400',
  },
});
