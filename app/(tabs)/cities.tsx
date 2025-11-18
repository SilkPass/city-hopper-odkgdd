
import React, { useState, useMemo } from 'react';
import { colors, darkColors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Platform,
  TextInput,
  Modal,
  Animated,
  useWindowDimensions,
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

export default function CitiesScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t, language } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const router = useRouter();

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCitySelectorModal, setShowCitySelectorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reorder cities based on language
  const orderedCities = useMemo(() => {
    if (language === 'mn') {
      // Mongolian order: Beijing, Hohhot, Ordos, Shanghai, Hong Kong, Macao
      return [
        CITIES.find(c => c.nameKey === 'beijing')!,
        CITIES.find(c => c.nameKey === 'hohhot')!,
        CITIES.find(c => c.nameKey === 'ordos')!,
        CITIES.find(c => c.nameKey === 'shanghai')!,
        CITIES.find(c => c.nameKey === 'hongKong')!,
        CITIES.find(c => c.nameKey === 'macao')!,
      ];
    } else {
      // Default order: Beijing, Shanghai, Hong Kong, Macao, Hohhot, Ordos
      return CITIES;
    }
  }, [language]);

  const handleCityPress = (city: City) => {
    console.log('City pressed:', city.name);
    
    if (isTablet) {
      // On tablet, show in sidebar
      setSelectedCity(city);
    } else {
      // On phone, navigate to detail page
      router.push(`/(tabs)/cities/${city.nameKey}`);
    }
  };

  const handleCitySelect = (city: City) => {
    console.log('City selected from dropdown:', city.name);
    setSelectedCity(city);
    setShowCitySelectorModal(false);
  };

  const filteredAttractions = selectedCity
    ? selectedCity.attractions.filter(attraction =>
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate card width with proper responsive logic
  const sidebarWidth = isTablet ? 320 : 0;
  const contentWidth = isTablet ? width - sidebarWidth : width;
  const horizontalPadding = isTablet ? 32 : 16;
  const availableWidth = contentWidth - (horizontalPadding * 2);
  
  // Determine number of columns based on screen size
  let numColumns = 2; // Default for phone
  if (isTablet) {
    numColumns = 4; // iPad shows 4 columns
  }
  
  // Calculate card width with gaps
  const gap = 20;
  const totalGapWidth = gap * (numColumns - 1);
  const cardWidth = (availableWidth - totalGapWidth) / numColumns;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
      <View style={styles.mainContainer}>
        {/* Sidebar - Only visible on iPad */}
        {isTablet && (
          <View style={[styles.sidebar, { 
            backgroundColor: currentColors.backgroundSecondary,
            borderRightColor: currentColors.separator,
            width: sidebarWidth,
          }]}>
            <View style={styles.sidebarHeader}>
              <Text style={[styles.sidebarTitle, { color: currentColors.text }]} numberOfLines={1}>
                {selectedCity ? t(selectedCity.nameKey) : t('selectCity')}
              </Text>
            </View>

            {selectedCity ? (
              <ScrollView 
                style={styles.sidebarContent}
                showsVerticalScrollIndicator={false}
              >
                {/* City Image */}
                <View style={styles.sidebarImageContainer}>
                  <Image
                    source={{ uri: selectedCity.imageUrl }}
                    style={styles.sidebarImage}
                    resizeMode="cover"
                  />
                </View>

                {/* City Info */}
                <View style={styles.sidebarInfo}>
                  <Text style={[styles.sidebarCityName, { color: currentColors.text }]} numberOfLines={2}>
                    {t(selectedCity.nameKey)}
                  </Text>
                  <Text style={[styles.sidebarProvince, { color: currentColors.textSecondary }]} numberOfLines={1}>
                    {t(selectedCity.provinceKey)}
                  </Text>
                </View>

                {/* Search Bar */}
                <View style={styles.sidebarSearchSection}>
                  <View style={[styles.sidebarSearchContainer, { 
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border 
                  }]}>
                    <IconSymbol name="magnifyingglass" color={currentColors.textSecondary} size={18} />
                    <TextInput
                      style={[styles.sidebarSearchInput, { color: currentColors.text }]}
                      placeholder={t('searchAttractions')}
                      placeholderTextColor={currentColors.textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                      <Pressable onPress={() => setSearchQuery('')}>
                        <IconSymbol name="xmark.circle.fill" color={currentColors.textSecondary} size={18} />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Attractions List */}
                <View style={styles.sidebarAttractions}>
                  <Text style={[styles.sidebarSectionTitle, { color: currentColors.text }]}>
                    {t('attractions')} ({filteredAttractions.length})
                  </Text>
                  
                  {filteredAttractions.length > 0 ? (
                    filteredAttractions.map((attraction) => (
                      <Pressable
                        key={attraction.id}
                        style={[styles.sidebarAttractionCard, { backgroundColor: currentColors.background }]}
                        onPress={() => console.log('Attraction pressed:', attraction.name)}
                      >
                        <View style={[styles.sidebarAttractionIcon, { backgroundColor: currentColors.primary + '15' }]}>
                          <IconSymbol name="mappin.circle.fill" color={currentColors.primary} size={20} />
                        </View>
                        <View style={styles.sidebarAttractionInfo}>
                          <Text style={[styles.sidebarAttractionName, { color: currentColors.text }]} numberOfLines={1}>
                            {attraction.name}
                          </Text>
                          <Text style={[styles.sidebarAttractionCategory, { color: currentColors.textSecondary }]} numberOfLines={1}>
                            {attraction.category}
                          </Text>
                          <Text style={[styles.sidebarAttractionDescription, { color: currentColors.textTertiary }]} numberOfLines={2}>
                            {attraction.description}
                          </Text>
                        </View>
                      </Pressable>
                    ))
                  ) : (
                    <View style={styles.sidebarNoResults}>
                      <IconSymbol name="magnifyingglass" color={currentColors.textTertiary} size={40} />
                      <Text style={[styles.sidebarNoResultsText, { color: currentColors.textSecondary }]}>
                        {searchQuery ? t('noAttractionsFound') : t('noAttractionsAvailable')}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.sidebarEmptyState}>
                <IconSymbol name="map.fill" color={currentColors.textTertiary} size={64} />
                <Text style={[styles.sidebarEmptyText, { color: currentColors.textSecondary }]}>
                  {t('selectCityToViewInfo')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Main Content */}
        <View style={[styles.contentContainer, { width: contentWidth }]}>
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with City Selector */}
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: currentColors.text, fontSize: isTablet ? 42 : 34 }]} numberOfLines={1}>
                {language === 'mn' ? 'Хот' : 'Cities'}
              </Text>
              {!isTablet && (
                <Pressable 
                  style={styles.citySelectorButton}
                  onPress={() => setShowCitySelectorModal(true)}
                >
                  <IconSymbol 
                    name="chevron.down" 
                    color={currentColors.primary} 
                    size={24} 
                  />
                </Pressable>
              )}
            </View>
            
            <View style={[styles.grid, { gap: gap }]}>
              {orderedCities.map((city, index) => (
                <Pressable
                  key={city.name}
                  style={[
                    styles.cityCard, 
                    { 
                      width: cardWidth,
                      borderColor: selectedCity?.name === city.name && isTablet ? currentColors.primary : 'transparent',
                      borderWidth: selectedCity?.name === city.name && isTablet ? 2 : 0,
                    }
                  ]}
                  onPress={() => handleCityPress(city)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: city.imageUrl }}
                      style={styles.cityImage}
                      resizeMode="cover"
                    />
                    <View style={[styles.overlay, { backgroundColor: currentColors.overlayLight }]} />
                  </View>
                  <View style={[styles.cityNameContainer, { backgroundColor: currentColors.backgroundSecondary }]}>
                    <Text style={[styles.cityName, { color: currentColors.text, fontSize: isTablet ? 18 : 17 }]} numberOfLines={1}>
                      {t(city.nameKey)}
                    </Text>
                    <Text style={[styles.attractionCount, { color: currentColors.textSecondary, fontSize: isTablet ? 14 : 13 }]} numberOfLines={1}>
                      {city.attractions.length} {t('attractions')}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* City Selector Modal - Only for phone */}
      {!isTablet && (
        <Modal
          visible={showCitySelectorModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCitySelectorModal(false)}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: currentColors.background }]} edges={['top', 'bottom']}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: currentColors.separator }]}>
              <Pressable onPress={() => setShowCitySelectorModal(false)} style={styles.backButton}>
                <IconSymbol name="xmark" color={currentColors.textSecondary} size={24} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: currentColors.text }]}>
                {t('selectCity')}
              </Text>
              <View style={styles.placeholder} />
            </View>

            {/* Cities List */}
            <ScrollView 
              style={styles.citiesList}
              contentContainerStyle={styles.citiesContent}
              showsVerticalScrollIndicator={false}
            >
              {orderedCities.map((city) => (
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
                  <Image
                    source={{ uri: city.imageUrl }}
                    style={styles.citySelectImage}
                    resizeMode="cover"
                  />
                  <View style={styles.citySelectInfo}>
                    <Text style={[styles.citySelectName, { color: currentColors.text }]} numberOfLines={1}>
                      {t(city.nameKey)}
                    </Text>
                    <Text style={[styles.citySelectProvince, { color: currentColors.textSecondary }]} numberOfLines={1}>
                      {t(city.provinceKey)}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  sidebarHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarImageContainer: {
    width: '100%',
    aspectRatio: 1.5,
    overflow: 'hidden',
  },
  sidebarImage: {
    width: '100%',
    height: '100%',
  },
  sidebarInfo: {
    padding: 20,
  },
  sidebarCityName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  sidebarProvince: {
    fontSize: 16,
    fontWeight: '500',
  },
  sidebarSearchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sidebarSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  sidebarSearchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
  },
  sidebarAttractions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sidebarSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sidebarAttractionCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  sidebarAttractionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  sidebarAttractionInfo: {
    flex: 1,
    minWidth: 0,
  },
  sidebarAttractionName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  sidebarAttractionCategory: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  sidebarAttractionDescription: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  sidebarNoResults: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  sidebarNoResultsText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  sidebarEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  sidebarEmptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'android' ? 100 : 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    letterSpacing: -1,
    flexShrink: 1,
  },
  citySelectorButton: {
    padding: 8,
    marginRight: -8,
    flexShrink: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cityNameContainer: {
    padding: 12,
  },
  cityName: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  attractionCount: {
    fontWeight: '400',
    textAlign: 'center',
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
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  citySelectImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    flexShrink: 0,
  },
  citySelectInfo: {
    flex: 1,
    minWidth: 0,
  },
  citySelectName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  citySelectProvince: {
    fontSize: 14,
    fontWeight: '500',
  },
});
