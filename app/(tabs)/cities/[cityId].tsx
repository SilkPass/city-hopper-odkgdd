
import React, { useState } from 'react';
import { colors, darkColors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';

interface City {
  name: string;
  nameKey: string;
  imageUrl: string;
  attractions: Attraction[];
  provinceKey: string;
}

interface Attraction {
  id: string;
  name: string;
  category: string;
  description: string;
}

const CITIES: City[] = [
  {
    name: 'Beijing',
    nameKey: 'beijing',
    provinceKey: 'beijingProvince',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    attractions: [
      { id: '1', name: 'Forbidden City', category: 'Historical Site', description: 'Imperial palace complex' },
      { id: '2', name: 'Summer Palace', category: 'Historical Site', description: 'Royal garden and palace' },
      { id: '3', name: 'Great Wall', category: 'Historical Site', description: 'Ancient fortification' },
      { id: '4', name: 'Temple of Heaven', category: 'Cultural Landmark', description: 'Imperial temple complex' },
    ],
  },
  {
    name: 'Shanghai',
    nameKey: 'shanghai',
    provinceKey: 'shanghaiProvince',
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    attractions: [
      { id: '8', name: 'The Bund', category: 'Scenic Spot', description: 'Waterfront promenade' },
      { id: '9', name: 'Yu Garden', category: 'Cultural Landmark', description: 'Classical Chinese garden' },
      { id: '10', name: 'Oriental Pearl Tower', category: 'Modern Attraction', description: 'Iconic TV tower' },
    ],
  },
  {
    name: 'Hong Kong',
    nameKey: 'hongKong',
    provinceKey: 'hongKongProvince',
    imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80',
    attractions: [
      { id: '14', name: 'Victoria Harbour', category: 'Scenic Spot', description: 'Natural harbor' },
      { id: '15', name: 'Victoria Peak', category: 'Scenic Spot', description: 'Mountain peak with views' },
      { id: '16', name: 'Temple Street', category: 'Cultural Landmark', description: 'Night market' },
    ],
  },
  {
    name: 'Macao',
    nameKey: 'macao',
    provinceKey: 'macaoProvince',
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
    attractions: [
      { id: '17', name: 'Ruins of St. Paul', category: 'Historical Site', description: 'Historic church facade' },
      { id: '18', name: 'Senado Square', category: 'Cultural Landmark', description: 'Historic town square' },
      { id: '19', name: 'A-Ma Temple', category: 'Cultural Landmark', description: 'Ancient Chinese temple' },
    ],
  },
  {
    name: 'Hohhot',
    nameKey: 'hohhot',
    provinceKey: 'hohhotProvince',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    attractions: [
      { id: '5', name: 'Dazhao Temple', category: 'Cultural Landmark', description: 'Historic Buddhist temple' },
      { id: '6', name: 'Inner Mongolia Museum', category: 'Cultural Landmark', description: 'Regional history museum' },
      { id: '7', name: 'Zhaojun Tomb', category: 'Historical Site', description: 'Ancient burial site' },
    ],
  },
  {
    name: 'Ordos',
    nameKey: 'ordos',
    provinceKey: 'ordosProvince',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    attractions: [
      { id: '11', name: 'Genghis Khan Mausoleum', category: 'Historical Site', description: 'Memorial complex' },
      { id: '12', name: 'Resonant Sand Gorge', category: 'Scenic Spot', description: 'Desert landscape' },
      { id: '13', name: 'Ordos Museum', category: 'Cultural Landmark', description: 'Modern architecture museum' },
    ],
  },
];

export default function CityDetailScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t, language } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityId = params.cityId as string;

  const [searchQuery, setSearchQuery] = useState('');

  // Find the city by nameKey
  const city = CITIES.find(c => c.nameKey === cityId);

  if (!city) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: t('cities'),
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.text,
            headerShadowVisible: false,
          }}
        />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" color={currentColors.textSecondary} size={64} />
          <Text style={[styles.errorText, { color: currentColors.text }]}>
            {t('noCitiesFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredAttractions = city.attractions.filter(attraction =>
    attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attraction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attraction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t(city.nameKey),
          headerStyle: {
            backgroundColor: currentColors.background,
          },
          headerTintColor: currentColors.text,
          headerShadowVisible: false,
          headerBackTitle: t('cities'),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* City Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: city.imageUrl }}
            style={styles.cityImage}
            resizeMode="cover"
          />
          <View style={[styles.imageOverlay, { backgroundColor: currentColors.overlayLight }]} />
        </View>

        {/* City Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.cityName, { color: currentColors.text }]}>
            {t(city.nameKey)}
          </Text>
          <Text style={[styles.province, { color: currentColors.textSecondary }]}>
            {t(city.provinceKey)}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { 
            backgroundColor: currentColors.backgroundSecondary,
            borderColor: currentColors.border 
          }]}>
            <IconSymbol name="magnifyingglass" color={currentColors.textSecondary} size={20} />
            <TextInput
              style={[styles.searchInput, { color: currentColors.text }]}
              placeholder={t('searchAttractions')}
              placeholderTextColor={currentColors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" color={currentColors.textSecondary} size={20} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Attractions List */}
        <View style={styles.attractionsSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('attractions')} ({filteredAttractions.length})
          </Text>
          
          {filteredAttractions.length > 0 ? (
            filteredAttractions.map((attraction) => (
              <Pressable
                key={attraction.id}
                style={[styles.attractionCard, { backgroundColor: currentColors.backgroundSecondary }]}
                onPress={() => console.log('Attraction pressed:', attraction.name)}
              >
                <View style={[styles.attractionIcon, { backgroundColor: currentColors.primary + '15' }]}>
                  <IconSymbol name="mappin.circle.fill" color={currentColors.primary} size={24} />
                </View>
                <View style={styles.attractionInfo}>
                  <Text style={[styles.attractionName, { color: currentColors.text }]}>
                    {attraction.name}
                  </Text>
                  <Text style={[styles.attractionCategory, { color: currentColors.textSecondary }]}>
                    {attraction.category}
                  </Text>
                  <Text style={[styles.attractionDescription, { color: currentColors.textTertiary }]}>
                    {attraction.description}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.noResults}>
              <IconSymbol name="magnifyingglass" color={currentColors.textTertiary} size={48} />
              <Text style={[styles.noResultsText, { color: currentColors.textSecondary }]}>
                {searchQuery ? t('noAttractionsFound') : t('noAttractionsAvailable')}
              </Text>
            </View>
          )}
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
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 100 : 20,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  cityName: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.8,
  },
  province: {
    fontSize: 17,
    fontWeight: '500',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  attractionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  attractionCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 14,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  attractionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  attractionInfo: {
    flex: 1,
    minWidth: 0,
  },
  attractionName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  attractionCategory: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  attractionDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  noResults: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
