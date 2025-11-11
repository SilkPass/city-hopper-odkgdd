
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
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>(CITIES);
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
    setSearchQuery("");
    setShowCityDropdown(false);
    setShowCitySelector(false);
    Keyboard.dismiss();
  };

  const handleSearchFocus = () => {
    if (locationPermission !== 'granted' || searchQuery.length > 0) {
      setShowCityDropdown(true);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0 || locationPermission !== 'granted') {
      setShowCityDropdown(true);
    } else {
      setShowCityDropdown(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    // Filter cities based on search query
    if (searchQuery.trim() === "") {
      setFilteredCities(sortedCities);
    } else {
      const filtered = sortedCities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.nameZh.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery, sortedCities]);

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
  }, [showCitySelector]);

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

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
        {/* Top Header Row: City Picker | Welcome Text | Profile Photo */}
        <View style={styles.topHeaderRow}>
          {/* City Picker Button */}
          <Pressable
            onPress={() => setShowCitySelector(true)}
            style={[styles.cityPickerButton, { backgroundColor: currentColors.cardSecondary }]}
          >
            <Text style={styles.cityPickerEmoji}>📍</Text>
          </Pressable>

          {/* Welcome Text (Center) */}
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, { color: currentColors.textSecondary }]}>
              {t('welcome')}
            </Text>
            <Text style={[styles.cityNameHeader, { color: currentColors.text }]}>
              {selectedCity?.name}
            </Text>
          </View>

          {/* Profile Photo */}
          <Pressable
            onPress={() => Alert.alert("Profile", "Profile feature")}
            style={styles.profilePhotoButton}
          >
            <View style={[styles.profilePicture, { backgroundColor: currentColors.primary }]}>
              <IconSymbol name="person.fill" color="#FFFFFF" size={20} />
            </View>
          </Pressable>
        </View>

        {/* Map Card with Inlaid Search Bar */}
        <View style={styles.mapContainer}>
          <View style={[styles.mapCard, { backgroundColor: currentColors.cardSecondary }]}>
            <View style={styles.mapPlaceholder}>
              <IconSymbol name="map.fill" color={currentColors.textTertiary} size={56} />
              <Text style={[styles.mapPlaceholderText, { color: currentColors.textSecondary }]}>
                Maps are not supported in Natively web preview
              </Text>
              <Text style={[styles.mapPlaceholderSubtext, { color: currentColors.textTertiary }]}>
                {selectedCity?.latitude.toFixed(4)}, {selectedCity?.longitude.toFixed(4)}
              </Text>
            </View>
          </View>

          {/* Search Bar Inlaid at Bottom of Map */}
          <View style={styles.searchInlayContainer}>
            <View style={styles.searchWrapper}>
              <View style={[styles.searchContainer, { backgroundColor: currentColors.backgroundSecondary }]}>
                <IconSymbol name="magnifyingglass" color={currentColors.textSecondary} size={18} />
                <TextInput
                  ref={searchInputRef}
                  style={[styles.searchInput, { color: currentColors.text }]}
                  placeholder={locationPermission === 'granted' ? t('searchDestinations') : t('searchSelectCity')}
                  placeholderTextColor={currentColors.textSecondary}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  onFocus={handleSearchFocus}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => {
                    setSearchQuery("");
                    setShowCityDropdown(false);
                  }}>
                    <IconSymbol name="xmark.circle.fill" color={currentColors.textSecondary} size={18} />
                  </Pressable>
                )}
              </View>

              {showCityDropdown && (
                <View style={[styles.cityDropdown, { backgroundColor: currentColors.backgroundSecondary }]}>
                  {locationPermission !== 'granted' && (
                    <View style={[styles.dropdownHeader, { 
                      backgroundColor: currentColors.info + '10',
                      borderBottomColor: currentColors.separator 
                    }]}>
                      <IconSymbol name="info.circle.fill" color={currentColors.info} size={14} />
                      <Text style={[styles.dropdownHeaderText, { color: currentColors.text }]}>
                        {t('selectCityToContinue')}
                      </Text>
                    </View>
                  )}
                  
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => {
                      const isSelected = selectedCity?.name === city.name;
                      const isClosest = index === 0 && userLocation && locationPermission === 'granted';
                      
                      return (
                        <Pressable
                          key={city.name}
                          style={[
                            styles.dropdownItem,
                            { borderBottomColor: currentColors.separator },
                            isSelected && { backgroundColor: currentColors.primary + '08' }
                          ]}
                          onPress={() => handleCitySelect(city)}
                        >
                          <View style={styles.dropdownItemLeft}>
                            <IconSymbol 
                              name="location.fill" 
                              color={isSelected ? currentColors.primary : currentColors.textSecondary} 
                              size={16} 
                            />
                            <View>
                              <Text style={[
                                styles.dropdownItemText,
                                { color: currentColors.text },
                                isSelected && { color: currentColors.primary }
                              ]}>
                                {city.name}
                              </Text>
                              {isClosest && (
                                <Text style={[styles.dropdownItemSubtext, { color: currentColors.textSecondary }]}>
                                  {t('closestToYou')}
                                </Text>
                              )}
                            </View>
                          </View>
                          {isSelected && (
                            <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={20} />
                          )}
                        </Pressable>
                      );
                    })
                  ) : (
                    <View style={styles.dropdownEmpty}>
                      <Text style={[styles.dropdownEmptyText, { color: currentColors.textSecondary }]}>
                        {t('noCitiesFound')}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('exploreServices')}
          </Text>
          
          <Pressable 
            style={[styles.serviceCardLarge, { backgroundColor: currentColors.backgroundSecondary }]}
            onPress={() => Alert.alert(t('myGuide'), t('exploreLocalRecommendations'))}
          >
            <View style={styles.serviceCardContent}>
              <View style={[styles.serviceIconLarge, { backgroundColor: currentColors.primary + '15' }]}>
                <IconSymbol name="book.fill" color={currentColors.primary} size={28} />
              </View>
              <View style={styles.serviceTextContainer}>
                <Text style={[styles.serviceTitle, { color: currentColors.text }]}>
                  {t('myGuide')}
                </Text>
                <Text style={[styles.serviceSubtitle, { color: currentColors.textSecondary }]}>
                  {t('exploreLocalRecommendations')}
                </Text>
              </View>
              <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={20} />
            </View>
          </Pressable>

          <View style={styles.serviceRow}>
            <Pressable 
              style={[styles.serviceCardSmall, { backgroundColor: currentColors.secondary }]}
              onPress={() => Alert.alert(t('esim'), t('stayConnected'))}
            >
              <View style={styles.serviceIconSmall}>
                <IconSymbol name="simcard.fill" color="#FFFFFF" size={32} />
              </View>
              <Text style={styles.serviceCardSmallTitle}>{t('esim')}</Text>
              <Text style={styles.serviceCardSmallSubtitle}>{t('stayConnected')}</Text>
            </Pressable>

            <Pressable 
              style={[styles.serviceCardSmall, { backgroundColor: currentColors.accent }]}
              onPress={() => Alert.alert(t('payment'), t('easyTransactions'))}
            >
              <View style={styles.serviceIconSmall}>
                <IconSymbol name="creditcard.fill" color="#FFFFFF" size={32} />
              </View>
              <Text style={styles.serviceCardSmallTitle}>{t('payment')}</Text>
              <Text style={styles.serviceCardSmallSubtitle}>{t('easyTransactions')}</Text>
            </Pressable>
          </View>
        </View>

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
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  cityPickerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  cityPickerEmoji: {
    fontSize: 24,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 2,
  },
  cityNameHeader: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  profilePhotoButton: {
    width: 44,
    height: 44,
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  mapContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  mapCard: {
    width: '100%',
    height: 280,
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
  searchInlayContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchWrapper: {
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
  },
  cityDropdown: {
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 280,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dropdownHeaderText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dropdownItemText: {
    fontSize: 17,
    fontWeight: '500',
  },
  dropdownItemSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  dropdownEmpty: {
    padding: 24,
    alignItems: 'center',
  },
  dropdownEmptyText: {
    fontSize: 15,
  },
  servicesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  serviceCardLarge: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  serviceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  serviceSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
  serviceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceCardSmall: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  serviceIconSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCardSmallTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  serviceCardSmallSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
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
