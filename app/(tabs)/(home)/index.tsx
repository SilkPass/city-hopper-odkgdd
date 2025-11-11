
import React, { useState, useEffect, useRef } from "react";
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
  FlatList,
  Keyboard
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import * as Location from 'expo-location';
import { colors } from "@/styles/commonStyles";

const { width } = Dimensions.get('window');

interface City {
  name: string;
  nameZh: string;
  latitude: number;
  longitude: number;
}

const CITIES: City[] = [
  { name: "Beijing", nameZh: "Beijing", latitude: 39.9042, longitude: 116.4074 },
  { name: "Shanghai", nameZh: "Shanghai", latitude: 31.2304, longitude: 121.4737 },
  { name: "Hong Kong", nameZh: "Hong Kong", latitude: 22.3193, longitude: 114.1694 },
];

export default function HomeScreen() {
  const theme = useTheme();
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

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

  const requestLocationPermission = async () => {
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
        // Default to showing cities in original order
        setSelectedCity(CITIES[0]);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLoading(false);
      setSelectedCity(CITIES[0]);
    }
  };

  const getUserLocation = async () => {
    try {
      console.log('Getting user location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log('User location:', location);
      setUserLocation(location);
      
      // Calculate distances and sort cities
      const citiesWithDistance = CITIES.map(city => ({
        ...city,
        distance: calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          city.latitude,
          city.longitude
        )
      }));
      
      // Sort by distance
      citiesWithDistance.sort((a, b) => a.distance - b.distance);
      setSortedCities(citiesWithDistance);
      
      // Select the closest city
      setSelectedCity(citiesWithDistance[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
      setSelectedCity(CITIES[0]);
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
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

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchQuery("");
    setShowCityDropdown(false);
    Keyboard.dismiss();
  };

  const handleSearchFocus = () => {
    // Show dropdown when search is focused, especially if location was denied
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

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Profile", "Profile feature")}
      style={styles.headerButtonContainer}
    >
      <View style={styles.profilePicture}>
        <IconSymbol name="person.fill" color="#FFFFFF" size={20} />
      </View>
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => setShowCitySelector(true)}
      style={styles.citySelector}
    >
      <IconSymbol name="location.fill" color={colors.primary} size={16} />
      <Text style={styles.citySelectorText}>{selectedCity?.name || 'Select City'}</Text>
      <IconSymbol name="chevron.down" color={colors.textSecondary} size={14} />
    </Pressable>
  );

  if (loading) {
    return (
      <>
        {Platform.OS === 'ios' && (
          <Stack.Screen
            options={{
              title: "Select Location",
              headerRight: renderHeaderRight,
              headerLeft: renderHeaderLeft,
            }}
          />
        )}
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Select Location",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      
      {/* City Selector Modal */}
      <Modal
        visible={showCitySelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCitySelector(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowCitySelector(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <Pressable onPress={() => setShowCitySelector(false)}>
                <IconSymbol name="xmark.circle.fill" color={colors.textSecondary} size={28} />
              </Pressable>
            </View>
            
            {sortedCities.map((city, index) => (
              <Pressable
                key={city.name}
                style={[
                  styles.cityModalItem,
                  selectedCity?.name === city.name && styles.cityModalItemSelected
                ]}
                onPress={() => {
                  setSelectedCity(city);
                  setShowCitySelector(false);
                }}
              >
                <View style={styles.cityModalItemContent}>
                  <Text style={[
                    styles.cityModalItemText,
                    selectedCity?.name === city.name && styles.cityModalItemTextSelected
                  ]}>
                    {city.name}
                  </Text>
                  {index === 0 && userLocation && (
                    <View style={styles.closestBadge}>
                      <Text style={styles.closestBadgeText}>Closest</Text>
                    </View>
                  )}
                </View>
                {selectedCity?.name === city.name && (
                  <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={24} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Selected City Display */}
        <View style={styles.cityHeader}>
          <Text style={styles.cityName}>
            Welcome to {selectedCity?.name}!
          </Text>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <IconSymbol name="map.fill" color={colors.textSecondary} size={48} />
            <Text style={styles.mapPlaceholderText}>
              Maps are not supported in Natively web preview.
            </Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Location: {selectedCity?.name} ({selectedCity?.latitude.toFixed(4)}, {selectedCity?.longitude.toFixed(4)})
            </Text>
          </View>
        </View>

        {/* Search Input with City Dropdown */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder={locationPermission === 'granted' ? "Search destination" : "Search and select city"}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => {
                setSearchQuery("");
                setShowCityDropdown(false);
              }}>
                <IconSymbol name="xmark.circle.fill" color={colors.textSecondary} size={20} />
              </Pressable>
            )}
          </View>

          {/* City Dropdown */}
          {showCityDropdown && (
            <View style={styles.cityDropdown}>
              {locationPermission !== 'granted' && (
                <View style={styles.dropdownHeader}>
                  <IconSymbol name="info.circle.fill" color={colors.primary} size={16} />
                  <Text style={styles.dropdownHeaderText}>
                    Select a city to continue
                  </Text>
                </View>
              )}
              
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <Pressable
                    key={city.name}
                    style={[
                      styles.dropdownItem,
                      selectedCity?.name === city.name && styles.dropdownItemSelected
                    ]}
                    onPress={() => handleCitySelect(city)}
                  >
                    <View style={styles.dropdownItemLeft}>
                      <IconSymbol 
                        name="location.fill" 
                        color={selectedCity?.name === city.name ? colors.primary : colors.textSecondary} 
                        size={18} 
                      />
                      <View>
                        <Text style={[
                          styles.dropdownItemText,
                          selectedCity?.name === city.name && styles.dropdownItemTextSelected
                        ]}>
                          {city.name}
                        </Text>
                        {index === 0 && userLocation && locationPermission === 'granted' && (
                          <Text style={styles.dropdownItemSubtext}>
                            Closest to you
                          </Text>
                        )}
                      </View>
                    </View>
                    {selectedCity?.name === city.name && (
                      <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={20} />
                    )}
                  </Pressable>
                ))
              ) : (
                <View style={styles.dropdownEmpty}>
                  <Text style={styles.dropdownEmptyText}>No cities found</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Service Buttons */}
        <Pressable 
          style={[styles.serviceButton, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert("My Guide", "Guide feature coming soon")}
        >
          <IconSymbol name="book.fill" color="#FFFFFF" size={24} />
          <Text style={styles.serviceButtonText}>My Guide</Text>
          <IconSymbol name="chevron.right" color="#FFFFFF" size={20} />
        </Pressable>

        <View style={styles.serviceRow}>
          <Pressable 
            style={[styles.serviceButtonSmall, { backgroundColor: colors.secondary }]}
            onPress={() => Alert.alert("eSIM", "eSIM feature coming soon")}
          >
            <IconSymbol name="simcard.fill" color="#FFFFFF" size={32} />
            <Text style={styles.serviceButtonSmallText}>eSIM</Text>
          </Pressable>

          <Pressable 
            style={[styles.serviceButtonSmall, { backgroundColor: colors.accent }]}
            onPress={() => Alert.alert("Payment", "Payment feature coming soon")}
          >
            <IconSymbol name="creditcard.fill" color="#FFFFFF" size={32} />
            <Text style={styles.serviceButtonSmallText}>Payment</Text>
          </Pressable>
        </View>

        {/* Location Permission Info */}
        {locationPermission !== 'granted' && (
          <View style={styles.permissionInfo}>
            <IconSymbol name="info.circle.fill" color={colors.primary} size={20} />
            <Text style={styles.permissionInfoText}>
              Enable location services to automatically find the nearest city
            </Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'android' ? 100 : 20,
  },
  headerButtonContainer: {
    padding: 8,
  },
  profilePicture: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  citySelectorText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  cityModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cityModalItemSelected: {
    borderColor: colors.primary,
  },
  cityModalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityModalItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cityModalItemTextSelected: {
    color: colors.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  cityHeader: {
    marginBottom: 16,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  mapContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.card,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mapPlaceholderSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  searchWrapper: {
    marginBottom: 16,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  cityDropdown: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 300,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.highlight,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownHeaderText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: colors.highlight,
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  dropdownItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dropdownEmpty: {
    padding: 20,
    alignItems: 'center',
  },
  dropdownEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  closestBadge: {
    marginTop: 4,
    backgroundColor: colors.highlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  closestBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  serviceButtonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  serviceButtonSmall: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  serviceButtonSmallText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  permissionInfoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
