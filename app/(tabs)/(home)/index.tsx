
import React, { useState, useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  ActivityIndicator,
  Dimensions,
  Alert,
  Modal
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import * as Location from 'expo-location';
import { colors, darkColors } from "@/styles/commonStyles";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

const CITIES: City[] = [
  { name: "Beijing", latitude: 39.9042, longitude: 116.4074 },
  { name: "Shanghai", latitude: 31.2304, longitude: 121.4737 },
  { name: "Hong Kong", latitude: 22.3193, longitude: 114.1694 },
  { name: "Guangzhou", latitude: 23.1291, longitude: 113.2644 },
  { name: "Shenzhen", latitude: 22.5431, longitude: 114.0579 },
];

export default function HomeScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getUserLocation = useCallback(async () => {
    try {
      console.log('Getting user location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log('User location:', location);
      setUserLocation(location);
      
      const citiesWithDistance = CITIES.map(city => ({
        ...city,
        distance: calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          city.latitude,
          city.longitude
        )
      }));
      
      citiesWithDistance.sort((a, b) => a.distance - b.distance);
      setSelectedCity(citiesWithDistance[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
      setSelectedCity(CITIES[0]);
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      console.log('Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);
      setLocationPermission(status);
      
      if (status === 'granted') {
        getUserLocation();
      } else {
        console.log('Location permission denied');
        setLoading(false);
        setSelectedCity(CITIES[0]);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLoading(false);
      setSelectedCity(CITIES[0]);
    }
  }, [getUserLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const handleServicePress = (service: string) => {
    console.log('Service pressed:', service);
    Alert.alert(service, `${service} feature coming soon!`);
  };

  const handleCitySelect = (city: City) => {
    console.log('City selected:', city.name);
    setSelectedCity(city);
    setShowCitySelector(false);
  };

  if (loading) {
    return (
      <>
        {Platform.OS === 'ios' && (
          <Stack.Screen
            options={{
              title: "",
              headerTransparent: false,
              headerStyle: {
                backgroundColor: currentColors.backgroundSecondary,
              },
            }}
          />
        )}
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
          <ActivityIndicator size="large" color={currentColors.primary} />
          <Text style={[styles.loadingText, { color: currentColors.textSecondary }]}>
            Getting your location...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "",
            headerTransparent: false,
            headerStyle: {
              backgroundColor: currentColors.backgroundSecondary,
            },
            headerShadowVisible: false,
          }}
        />
      )}
      
      <ScrollView 
        style={[styles.container, { backgroundColor: currentColors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with City Selector */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: currentColors.textSecondary }]}>
            Welcome to
          </Text>
          <Pressable 
            style={styles.citySelector}
            onPress={() => setShowCitySelector(true)}
          >
            <Text style={[styles.title, { color: currentColors.text }]}>
              {selectedCity?.name || 'Your City'}
            </Text>
            <IconSymbol 
              name="chevron.down" 
              color={currentColors.primary} 
              size={28} 
              style={styles.chevronIcon}
            />
          </Pressable>
        </View>

        {/* Map Card - No title, 1:1 aspect ratio */}
        <View style={styles.section}>
          <Pressable 
            style={[styles.mapCard, { backgroundColor: currentColors.cardSecondary }]}
            onPress={() => handleServicePress('Map')}
          >
            <View style={styles.mapPlaceholder}>
              <IconSymbol name="map.fill" color={currentColors.primary} size={56} />
              <Text style={[styles.mapPlaceholderText, { color: currentColors.textSecondary }]}>
                Maps are not supported in Natively web preview
              </Text>
              {selectedCity && (
                <Text style={[styles.mapPlaceholderSubtext, { color: currentColors.textTertiary }]}>
                  {selectedCity.latitude.toFixed(4)}, {selectedCity.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          </Pressable>
        </View>

        {/* Services Grid - Reordered: eSIM, Payment on line 1; Guide, Emergency on line 2 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            Services
          </Text>
          
          <View style={styles.servicesGrid}>
            {/* eSIM Service - Line 1 */}
            <Pressable 
              style={[styles.serviceCard, { backgroundColor: currentColors.backgroundSecondary }]}
              onPress={() => handleServicePress('eSIM')}
            >
              <View style={[styles.serviceIconContainer, { backgroundColor: currentColors.accent + '15' }]}>
                <IconSymbol name="antenna.radiowaves.left.and.right" color={currentColors.accent} size={32} />
              </View>
              <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                eSIM
              </Text>
              <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                Stay connected locally
              </Text>
            </Pressable>

            {/* Payment Service - Line 1 */}
            <Pressable 
              style={[styles.serviceCard, { backgroundColor: currentColors.backgroundSecondary }]}
              onPress={() => handleServicePress('Payment')}
            >
              <View style={[styles.serviceIconContainer, { backgroundColor: currentColors.secondary + '15' }]}>
                <IconSymbol name="creditcard.fill" color={currentColors.secondary} size={32} />
              </View>
              <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                Payment
              </Text>
              <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                Secure payment options
              </Text>
            </Pressable>

            {/* Guide Service - Line 2 */}
            <Pressable 
              style={[styles.serviceCard, { backgroundColor: currentColors.backgroundSecondary }]}
              onPress={() => handleServicePress('Travel Guide')}
            >
              <View style={[styles.serviceIconContainer, { backgroundColor: currentColors.primary + '15' }]}>
                <IconSymbol name="book.fill" color={currentColors.primary} size={32} />
              </View>
              <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                Guide
              </Text>
              <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                Explore local attractions
              </Text>
            </Pressable>

            {/* Emergency Service - Line 2 */}
            <Pressable 
              style={[styles.serviceCard, { backgroundColor: currentColors.backgroundSecondary }]}
              onPress={() => handleServicePress('Emergency')}
            >
              <View style={[styles.serviceIconContainer, { backgroundColor: currentColors.error + '15' }]}>
                <IconSymbol name="phone.fill" color={currentColors.error} size={32} />
              </View>
              <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                Emergency
              </Text>
              <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                Quick emergency access
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { paddingBottom: Platform.OS === 'android' ? 100 : 20 }]}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            Quick Actions
          </Text>
          
          <Pressable 
            style={[styles.actionCard, { backgroundColor: currentColors.backgroundSecondary }]}
            onPress={() => handleServicePress('Weather')}
          >
            <View style={[styles.actionIcon, { backgroundColor: currentColors.info + '15' }]}>
              <IconSymbol name="cloud.sun.fill" color={currentColors.info} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: currentColors.text }]}>
                Weather Forecast
              </Text>
              <Text style={[styles.actionSubtitle, { color: currentColors.textSecondary }]}>
                Check local weather conditions
              </Text>
            </View>
            <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={20} />
          </Pressable>

          <Pressable 
            style={[styles.actionCard, { backgroundColor: currentColors.backgroundSecondary }]}
            onPress={() => handleServicePress('Transportation')}
          >
            <View style={[styles.actionIcon, { backgroundColor: currentColors.success + '15' }]}>
              <IconSymbol name="car.fill" color={currentColors.success} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: currentColors.text }]}>
                Transportation
              </Text>
              <Text style={[styles.actionSubtitle, { color: currentColors.textSecondary }]}>
                Find nearby transit options
              </Text>
            </View>
            <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={20} />
          </Pressable>

          <Pressable 
            style={[styles.actionCard, { backgroundColor: currentColors.backgroundSecondary }]}
            onPress={() => handleServicePress('Language')}
          >
            <View style={[styles.actionIcon, { backgroundColor: currentColors.warning + '15' }]}>
              <IconSymbol name="globe" color={currentColors.warning} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: currentColors.text }]}>
                Language Assistant
              </Text>
              <Text style={[styles.actionSubtitle, { color: currentColors.textSecondary }]}>
                Translate and communicate easily
              </Text>
            </View>
            <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={20} />
          </Pressable>
        </View>
      </ScrollView>

      {/* City Selector Modal */}
      <Modal
        visible={showCitySelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCitySelector(false)}
      >
        <SafeAreaView 
          style={[styles.modalContainer, { backgroundColor: currentColors.background }]} 
          edges={['top', 'bottom']}
        >
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: currentColors.separator }]}>
            <Pressable onPress={() => setShowCitySelector(false)} style={styles.backButton}>
              <IconSymbol name="xmark" color={currentColors.textSecondary} size={24} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              Select City
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Cities List */}
          <ScrollView 
            style={styles.citiesList}
            contentContainerStyle={styles.citiesContent}
            showsVerticalScrollIndicator={false}
          >
            {CITIES.map((city) => (
              <Pressable
                key={city.name}
                style={[
                  styles.citySelectCard, 
                  { 
                    backgroundColor: currentColors.backgroundSecondary,
                    borderColor: selectedCity?.name === city.name ? currentColors.primary : 'transparent',
                    borderWidth: selectedCity?.name === city.name ? 2 : 0,
                  }
                ]}
                onPress={() => handleCitySelect(city)}
              >
                <View style={[styles.cityIconContainer, { backgroundColor: currentColors.primary + '15' }]}>
                  <IconSymbol name="building.2.fill" color={currentColors.primary} size={32} />
                </View>
                <View style={styles.citySelectInfo}>
                  <Text style={[styles.citySelectName, { color: currentColors.text }]}>
                    {city.name}
                  </Text>
                  <Text style={[styles.citySelectCoords, { color: currentColors.textSecondary }]}>
                    {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </Text>
                </View>
                {selectedCity?.name === city.name && (
                  <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={28} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
  },
  chevronIcon: {
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  mapCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    marginTop: 12,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  mapPlaceholderSubtext: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
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
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
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
  citiesList: {
    flex: 1,
  },
  citiesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  citySelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  cityIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  citySelectInfo: {
    flex: 1,
  },
  citySelectName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  citySelectCoords: {
    fontSize: 14,
    fontWeight: '500',
  },
});
