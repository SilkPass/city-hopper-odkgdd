
import * as Location from 'expo-location';
import { Stack, useRouter } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { colors, darkColors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "@react-navigation/native";
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
  Modal,
  Linking,
  ImageBackground
} from "react-native";
import { useThemeMode } from "@/contexts/ThemeContext";
import { IconSymbol } from "@/components/IconSymbol";

interface City {
  name: string;
  nameKey: string;
  latitude: number;
  longitude: number;
  provinceKey: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

interface EmergencyNumber {
  id: string;
  number: string;
  titleKey: string;
  color: string;
}

const CITIES: City[] = [
  { name: 'Beijing', nameKey: 'city_beijing', latitude: 39.9042, longitude: 116.4074, provinceKey: 'province_beijing' },
  { name: 'Shanghai', nameKey: 'city_shanghai', latitude: 31.2304, longitude: 121.4737, provinceKey: 'province_shanghai' },
  { name: 'Hong Kong', nameKey: 'city_hongkong', latitude: 22.3193, longitude: 114.1694, provinceKey: 'province_hongkong' },
];

const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { id: '1', number: '110', titleKey: 'emergency_police', color: '#3B82F6' },
  { id: '2', number: '120', titleKey: 'emergency_ambulance', color: '#EF4444' },
  { id: '3', number: '119', titleKey: 'emergency_fire', color: '#F59E0B' },
];

export default function HomeScreen() {
  const { t } = useLanguage();
  const { isDark } = useThemeMode();
  const theme = useTheme();
  const router = useRouter();
  const currentColors = useMemo(() => isDark ? darkColors : colors, [isDark]);
  
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        // Find nearest city
        const distances = CITIES.map(city => ({
          city,
          distance: calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            city.latitude,
            city.longitude
          ),
        }));
        const nearest = distances.sort((a, b) => a.distance - b.distance)[0];
        setSelectedCity(nearest.city);
      }
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    if (selectedCity) {
      fetchWeather();
    }
  }, [selectedCity]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,weather_code&timezone=auto`
      );
      const data = await response.json();
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        condition: getWeatherCondition(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code),
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  };

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return 'weather_clear';
    if (code <= 3) return 'weather_cloudy';
    if (code <= 67) return 'weather_rainy';
    if (code <= 77) return 'weather_snowy';
    return 'weather_stormy';
  };

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return 'wb-sunny';
    if (code <= 3) return 'cloud';
    if (code <= 67) return 'opacity';
    if (code <= 77) return 'ac-unit';
    return 'flash-on';
  };

  const handleServicePress = (service: string) => {
    console.log('Service pressed:', service);
    if (service === 'esim') {
      router.push('/esim');
    } else if (service === 'emergency') {
      setShowEmergencyModal(true);
    }
  };

  const handleCitySelect = (city: City) => {
    console.log('City selected:', city.name);
    setSelectedCity(city);
    setShowCityPicker(false);
  };

  const handleEmergencyCall = (number: string) => {
    console.log('Emergency call requested:', number);
    Alert.alert(
      t('emergency_call_title'),
      t('emergency_call_confirm').replace('{number}', number),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('call'), onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  const getStaticMapUrl = (city: City) => {
    // Using a static map image from OpenStreetMap
    const zoom = 12;
    const width = 600;
    const height = 400;
    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=${width}&height=${height}&center=lonlat:${city.longitude},${city.latitude}&zoom=${zoom}&marker=lonlat:${city.longitude},${city.latitude};color:%23ff0000;size:medium&apiKey=demo`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <ActivityIndicator size="large" color={currentColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Section - Using static map image */}
        <View style={styles.mapContainer}>
          <ImageBackground
            source={{ uri: getStaticMapUrl(selectedCity) }}
            style={styles.map}
            resizeMode="cover"
          >
            {Platform.OS === 'web' && (
              <View style={[styles.webMapNotice, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <IconSymbol 
                  ios_icon_name="info.circle" 
                  android_material_icon_name="info" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.webMapNoticeText}>
                  Interactive maps are not available on web. Showing static map view.
                </Text>
              </View>
            )}
          </ImageBackground>
          
          {/* City Selector Overlay */}
          <Pressable
            style={[styles.citySelector, { backgroundColor: currentColors.card }]}
            onPress={() => setShowCityPicker(true)}
          >
            <View style={styles.citySelectorContent}>
              <View>
                <Text style={[styles.cityName, { color: currentColors.text }]}>
                  {t(selectedCity.nameKey)}
                </Text>
                <Text style={[styles.provinceName, { color: currentColors.textSecondary }]}>
                  {t(selectedCity.provinceKey)}
                </Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.down" 
                android_material_icon_name="arrow-drop-down" 
                size={24} 
                color={currentColors.text} 
              />
            </View>
            
            {weather && (
              <View style={styles.weatherInfo}>
                <IconSymbol 
                  ios_icon_name="sun.max.fill" 
                  android_material_icon_name={weather.icon} 
                  size={32} 
                  color={currentColors.primary} 
                />
                <Text style={[styles.temperature, { color: currentColors.text }]}>
                  {weather.temperature}°C
                </Text>
                <Text style={[styles.condition, { color: currentColors.textSecondary }]}>
                  {t(weather.condition)}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Services Section */}
        <View style={styles.servicesContainer}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('services')}
          </Text>
          
          <View style={styles.servicesGrid}>
            <Pressable
              style={[styles.serviceCard, { backgroundColor: currentColors.card }]}
              onPress={() => handleServicePress('esim')}
            >
              <IconSymbol 
                ios_icon_name="antenna.radiowaves.left.and.right" 
                android_material_icon_name="signal-cellular-alt" 
                size={32} 
                color="#3B82F6" 
              />
              <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                {t('service_esim')}
              </Text>
              <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                {t('service_esim_desc')}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.serviceCard, { backgroundColor: currentColors.card }]}
              onPress={() => handleServicePress('package')}
            >
              <IconSymbol 
                ios_icon_name="shippingbox.fill" 
                android_material_icon_name="local-shipping" 
                size={32} 
                color="#10B981" 
              />
              <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                {t('service_package')}
              </Text>
              <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                {t('service_package_desc')}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.serviceCard, { backgroundColor: currentColors.card }]}
              onPress={() => handleServicePress('emergency')}
            >
              <IconSymbol 
                ios_icon_name="phone.fill" 
                android_material_icon_name="phone" 
                size={32} 
                color="#EF4444" 
              />
              <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                {t('service_emergency')}
              </Text>
              <Text style={[styles.serviceDescription, { color: currentColors.textSecondary }]}>
                {t('service_emergency_desc')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* City Picker Modal */}
      <Modal
        visible={showCityPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCityPicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: currentColors.card }]}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              {t('select_city')}
            </Text>
            {CITIES.map((city, index) => (
              <React.Fragment key={city.name}>
                <Pressable
                  style={styles.cityOption}
                  onPress={() => handleCitySelect(city)}
                >
                  <Text style={[styles.cityOptionText, { color: currentColors.text }]}>
                    {t(city.nameKey)}
                  </Text>
                  {selectedCity.name === city.name && (
                    <IconSymbol 
                      ios_icon_name="checkmark" 
                      android_material_icon_name="check" 
                      size={20} 
                      color={currentColors.primary} 
                    />
                  )}
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Emergency Modal */}
      <Modal
        visible={showEmergencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmergencyModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEmergencyModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: currentColors.card }]}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              {t('emergency_numbers')}
            </Text>
            {EMERGENCY_NUMBERS.map((item, index) => (
              <React.Fragment key={item.id}>
                <Pressable
                  style={[styles.emergencyButton, { backgroundColor: item.color }]}
                  onPress={() => handleEmergencyCall(item.number)}
                >
                  <Text style={styles.emergencyNumber}>{item.number}</Text>
                  <Text style={styles.emergencyTitle}>{t(item.titleKey)}</Text>
                </Pressable>
              </React.Fragment>
            ))}
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
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapNotice: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webMapNoticeText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  citySelector: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
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
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  citySelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '600',
  },
  provinceName: {
    fontSize: 14,
    marginTop: 2,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '700',
  },
  condition: {
    fontSize: 14,
  },
  servicesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  serviceDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  cityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  cityOptionText: {
    fontSize: 16,
  },
  emergencyButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  emergencyNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emergencyTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
});
