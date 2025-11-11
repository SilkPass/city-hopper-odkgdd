
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  Platform,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Modal,
  Keyboard,
  Animated
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import * as Location from 'expo-location';
import { colors, darkColors } from "@/styles/commonStyles";
import { BlurView } from 'expo-blur';
import { useThemeMode } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const { width } = Dimensions.get('window');

interface City {
  name: string;
  nameZh: string;
  latitude: number;
  longitude: number;
}

interface Attraction {
  id: string;
  name: string;
  city: string;
  category: string;
  description: string;
}

const CITIES: City[] = [
  { name: "Beijing", nameZh: "北京", latitude: 39.9042, longitude: 116.4074 },
  { name: "Shanghai", nameZh: "上海", latitude: 31.2304, longitude: 121.4737 },
  { name: "Hong Kong", nameZh: "香港", latitude: 22.3193, longitude: 114.1694 },
  { name: "Guangzhou", nameZh: "广州", latitude: 23.1291, longitude: 113.2644 },
  { name: "Shenzhen", nameZh: "深圳", latitude: 22.5431, longitude: 114.0579 },
  { name: "Chengdu", nameZh: "成都", latitude: 30.5728, longitude: 104.0668 },
  { name: "Hangzhou", nameZh: "杭州", latitude: 30.2741, longitude: 120.1551 },
  { name: "Xi'an", nameZh: "西安", latitude: 34.3416, longitude: 108.9398 },
];

const ATTRACTIONS: Attraction[] = [
  { id: '1', name: 'Forbidden City', city: 'Beijing', category: 'Historical Site', description: 'Imperial palace complex' },
  { id: '2', name: 'Summer Palace', city: 'Beijing', category: 'Historical Site', description: 'Royal garden and palace' },
  { id: '3', name: 'Great Wall', city: 'Beijing', category: 'Historical Site', description: 'Ancient fortification' },
  { id: '4', name: 'Temple of Heaven', city: 'Beijing', category: 'Cultural Landmark', description: 'Imperial temple complex' },
  { id: '5', name: 'The Bund', city: 'Shanghai', category: 'Scenic Spot', description: 'Waterfront promenade' },
  { id: '6', name: 'Yu Garden', city: 'Shanghai', category: 'Cultural Landmark', description: 'Classical Chinese garden' },
  { id: '7', name: 'Oriental Pearl Tower', city: 'Shanghai', category: 'Modern Attraction', description: 'Iconic TV tower' },
  { id: '8', name: 'Victoria Harbour', city: 'Hong Kong', category: 'Scenic Spot', description: 'Natural harbor' },
  { id: '9', name: 'Victoria\'s Peak', city: 'Hong Kong', category: 'Scenic Spot', description: 'Mountain peak with views' },
  { id: '10', name: 'Temple Street', city: 'Hong Kong', category: 'Cultural Landmark', description: 'Night market' },
];

export default function HomeScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [sortedCities, setSortedCities] = useState<City[]>(CITIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [showAttractionResults, setShowAttractionResults] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
      setSortedCities(citiesWithDistance);
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

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setShowCitySelector(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (!selectedCity) {
      setShowAttractionResults(false);
      return;
    }
    
    if (text.trim().length > 0) {
      const cityAttractions = ATTRACTIONS.filter(attr => attr.city === selectedCity.name);
      const filtered = cityAttractions.filter(attraction => 
        attraction.name.toLowerCase().includes(text.toLowerCase()) ||
        attraction.category.toLowerCase().includes(text.toLowerCase()) ||
        attraction.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAttractions(filtered);
      setShowAttractionResults(true);
    } else {
      setFilteredAttractions([]);
      setShowAttractionResults(false);
    }
  };

  const handleAttractionSelect = (attraction: Attraction) => {
    console.log('Selected attraction:', attraction);
    Alert.alert(attraction.name, attraction.description);
    setSearchQuery("");
    setShowAttractionResults(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    if (showCitySelector) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [showCitySelector, slideAnim]);

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const cityAttractions = selectedCity 
    ? ATTRACTIONS.filter(attr => attr.city === selectedCity.name)
    : [];

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
            {t('gettingYourLocation')}
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
      
      {/* City Selector Modal */}
      <Modal
        visible={showCitySelector}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowCitySelector(false)}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: currentColors.overlay }]}
          onPress={() => setShowCitySelector(false)}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: currentColors.backgroundSecondary,
                transform: [{ translateY: modalTranslateY }],
              }
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.modalHandle, { backgroundColor: currentColors.separator }]} />
              
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: currentColors.text }]}>
                  {t('selectCity')}
                </Text>
                <Pressable 
                  onPress={() => setShowCitySelector(false)}
                  style={styles.modalCloseButton}
                >
                  <IconSymbol name="xmark.circle.fill" color={currentColors.textSecondary} size={28} />
                </Pressable>
              </View>
              
              <ScrollView 
                style={styles.cityList}
                showsVerticalScrollIndicator={false}
              >
                {sortedCities.map((city, index) => {
                  const isSelected = selectedCity?.name === city.name;
                  const isClosest = index === 0 && userLocation && locationPermission === 'granted';
                  
                  return (
                    <Pressable
                      key={city.name}
                      style={[
                        styles.cityModalItem,
                        { backgroundColor: currentColors.cardSecondary },
                        isSelected && { backgroundColor: currentColors.primary + '15' }
                      ]}
                      onPress={() => handleCitySelect(city)}
                    >
                      <View style={styles.cityModalItemLeft}>
                        <View style={[
                          styles.cityIconContainer,
                          { backgroundColor: currentColors.separator },
                          isSelected && { backgroundColor: currentColors.primary + '20' }
                        ]}>
                          <IconSymbol 
                            name="location.fill" 
                            color={isSelected ? currentColors.primary : currentColors.textSecondary} 
                            size={18} 
                          />
                        </View>
                        <View style={styles.cityModalItemTextContainer}>
                          <Text style={[
                            styles.cityModalItemText,
                            { color: currentColors.text },
                            isSelected && { color: currentColors.primary }
                          ]}>
                            {city.name}
                          </Text>
                          {isClosest && (
                            <View style={styles.closestBadge}>
                              <IconSymbol name="location.fill" color={currentColors.primary} size={10} />
                              <Text style={[styles.closestBadgeText, { color: currentColors.primary }]}>
                                {t('closestToYou')}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {isSelected && (
                        <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={24} />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      <ScrollView 
        style={[styles.container, { backgroundColor: currentColors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* City Selector Button */}
        <View style={styles.citySelectorContainer}>
          <Pressable
            onPress={() => setShowCitySelector(true)}
            style={[styles.citySelectorButton, { 
              backgroundColor: currentColors.backgroundSecondary,
              borderColor: currentColors.border 
            }]}
          >
            <View style={styles.citySelectorContent}>
              <View style={[styles.citySelectorIcon, { backgroundColor: currentColors.primary + '15' }]}>
                <IconSymbol name="location.fill" color={currentColors.primary} size={20} />
              </View>
              <View style={styles.citySelectorTextContainer}>
                <Text style={[styles.citySelectorLabel, { color: currentColors.textSecondary }]}>
                  Current City
                </Text>
                <Text style={[styles.citySelectorCity, { color: currentColors.text }]}>
                  {selectedCity?.name || 'Select City'}
                </Text>
              </View>
              <IconSymbol name="chevron.down" color={currentColors.textTertiary} size={20} />
            </View>
          </Pressable>
        </View>

        {/* Search Bar for Attractions */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { 
            backgroundColor: currentColors.backgroundSecondary,
            borderColor: currentColors.border 
          }]}>
            <IconSymbol name="magnifyingglass" color={currentColors.textSecondary} size={20} />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: currentColors.text }]}
              placeholder={selectedCity ? t('searchAttractions') : t('selectCityFirst')}
              placeholderTextColor={currentColors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              editable={!!selectedCity}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => {
                setSearchQuery("");
                setShowAttractionResults(false);
              }}>
                <IconSymbol name="xmark.circle.fill" color={currentColors.textSecondary} size={20} />
              </Pressable>
            )}
          </View>

          {/* Attraction Search Results */}
          {showAttractionResults && (
            <View style={[styles.attractionResults, { 
              backgroundColor: currentColors.backgroundSecondary,
              borderColor: currentColors.border 
            }]}>
              {filteredAttractions.length > 0 ? (
                filteredAttractions.map((attraction) => (
                  <Pressable
                    key={attraction.id}
                    style={[styles.attractionItem, { borderBottomColor: currentColors.separator }]}
                    onPress={() => handleAttractionSelect(attraction)}
                  >
                    <View style={[styles.attractionIcon, { backgroundColor: currentColors.primary + '10' }]}>
                      <IconSymbol name="mappin.circle.fill" color={currentColors.primary} size={24} />
                    </View>
                    <View style={styles.attractionInfo}>
                      <Text style={[styles.attractionName, { color: currentColors.text }]}>
                        {attraction.name}
                      </Text>
                      <Text style={[styles.attractionCategory, { color: currentColors.textSecondary }]}>
                        {attraction.category}
                      </Text>
                    </View>
                    <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={18} />
                  </Pressable>
                ))
              ) : (
                <View style={styles.noResults}>
                  <IconSymbol name="magnifyingglass" color={currentColors.textTertiary} size={32} />
                  <Text style={[styles.noResultsText, { color: currentColors.textSecondary }]}>
                    {t('noAttractionsFound')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Map Placeholder */}
        <View style={[styles.mapCard, { backgroundColor: currentColors.cardSecondary }]}>
          <View style={styles.mapPlaceholder}>
            <IconSymbol name="map.fill" color={currentColors.textTertiary} size={56} />
            <Text style={[styles.mapPlaceholderText, { color: currentColors.textSecondary }]}>
              Maps are not supported in Natively web preview
            </Text>
            {selectedCity && (
              <Text style={[styles.mapPlaceholderSubtext, { color: currentColors.textTertiary }]}>
                {selectedCity.latitude.toFixed(4)}, {selectedCity.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>

        {/* Popular Attractions Section */}
        {selectedCity && cityAttractions.length > 0 && (
          <View style={styles.attractionsSection}>
            <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
              {t('popularAttractions')}
            </Text>
            
            {cityAttractions.map((attraction) => (
              <Pressable
                key={attraction.id}
                style={[styles.attractionCard, { backgroundColor: currentColors.backgroundSecondary }]}
                onPress={() => handleAttractionSelect(attraction)}
              >
                <View style={styles.attractionCardContent}>
                  <View style={[styles.attractionCardIcon, { backgroundColor: currentColors.primary + '15' }]}>
                    <IconSymbol name="mappin.circle.fill" color={currentColors.primary} size={28} />
                  </View>
                  <View style={styles.attractionCardText}>
                    <Text style={[styles.attractionCardTitle, { color: currentColors.text }]}>
                      {attraction.name}
                    </Text>
                    <Text style={[styles.attractionCardSubtitle, { color: currentColors.textSecondary }]}>
                      {attraction.category} • {attraction.description}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={20} />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Location Permission Info */}
        {locationPermission !== 'granted' && (
          <View style={[styles.permissionCard, { backgroundColor: currentColors.backgroundSecondary }]}>
            <View style={[styles.permissionIconContainer, { backgroundColor: currentColors.primary + '15' }]}>
              <IconSymbol name="location.fill" color={currentColors.primary} size={24} />
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={[styles.permissionTitle, { color: currentColors.text }]}>
                {t('enableLocation')}
              </Text>
              <Text style={[styles.permissionText, { color: currentColors.textSecondary }]}>
                {t('allowLocationAccess')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: Platform.OS === 'android' ? 100 : 20,
  },
  citySelectorContainer: {
    marginBottom: 16,
  },
  citySelectorButton: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  citySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  citySelectorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  citySelectorTextContainer: {
    flex: 1,
  },
  citySelectorLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  citySelectorCity: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  searchSection: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '400',
  },
  attractionResults: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: 320,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  attractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  attractionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attractionInfo: {
    flex: 1,
  },
  attractionName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  attractionCategory: {
    fontSize: 13,
    fontWeight: '400',
  },
  noResults: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  noResultsText: {
    fontSize: 15,
    fontWeight: '500',
  },
  mapCard: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
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
  attractionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  attractionCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  attractionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  attractionCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attractionCardText: {
    flex: 1,
  },
  attractionCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  attractionCardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  permissionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  permissionText: {
    fontSize: 13,
    lineHeight: 18,
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
    maxHeight: '80%',
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
  cityList: {
    paddingHorizontal: 20,
  },
  cityModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  cityModalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityModalItemTextContainer: {
    flex: 1,
  },
  cityModalItemText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  closestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  closestBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
  },
});
