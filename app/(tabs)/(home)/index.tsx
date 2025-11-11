
import React, { useState, useEffect } from "react";
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
  Dimensions
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
  { name: "Beijing", nameZh: "北京", latitude: 39.9042, longitude: 116.4074 },
  { name: "Shanghai", nameZh: "上海", latitude: 31.2304, longitude: 121.4737 },
  { name: "Hong Kong", nameZh: "香港", latitude: 22.3193, longitude: 114.1694 },
];

export default function HomeScreen() {
  const theme = useTheme();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [sortedCities, setSortedCities] = useState<City[]>(CITIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

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

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Settings", "Settings feature coming soon")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.primary} size={24} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <View style={styles.headerLeft}>
      <View style={styles.locationBadge}>
        <IconSymbol name="location.fill" color="#FF3B30" size={16} />
        <Text style={styles.locationBadgeText}>阿拉木图</Text>
      </View>
      <View style={styles.userBadge}>
        <IconSymbol name="person.fill" color={colors.textSecondary} size={16} />
        <Text style={styles.userBadgeText}>@Jerry</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <>
        {Platform.OS === 'ios' && (
          <Stack.Screen
            options={{
              title: "选择地点",
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
            title: "选择地点",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected City Display */}
        <View style={styles.cityHeader}>
          <Text style={styles.cityName}>
            {selectedCity?.name}, {selectedCity?.nameZh}!
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

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索目的地"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* City Selection Buttons */}
        <View style={styles.cityButtonsContainer}>
          {sortedCities.map((city, index) => (
            <Pressable
              key={city.name}
              style={[
                styles.cityButton,
                selectedCity?.name === city.name && styles.cityButtonSelected
              ]}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={[
                styles.cityButtonText,
                selectedCity?.name === city.name && styles.cityButtonTextSelected
              ]}>
                {city.nameZh}
              </Text>
              {index === 0 && userLocation && (
                <View style={styles.closestBadge}>
                  <Text style={styles.closestBadgeText}>Closest</Text>
                </View>
              )}
            </Pressable>
          ))}
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
            <Text style={styles.serviceButtonSmallText}>支付</Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  locationBadgeText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  userBadgeText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  cityButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  cityButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cityButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  cityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cityButtonTextSelected: {
    color: colors.primary,
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
