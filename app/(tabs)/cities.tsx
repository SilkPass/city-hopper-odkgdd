
import React, { useState, useMemo } from 'react';
import { colors, darkColors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { IconSymbol } from '@/components/IconSymbol';
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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const cardWidth = isTablet ? (width - 96) / 5 : (width - 48) / 2;

export default function CitiesScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t, language } = useLanguage();
  const currentColors = isDark ? darkColors : colors;

  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [showCityModal, setShowCityModal] = useState(false);
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
    setSelectedCity(city);
    setShowCityModal(true);
  };

  const handleCloseModal = () => {
    setShowCityModal(false);
    setSearchQuery('');
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

  const horizontalPadding = isTablet ? 32 : 16;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with City Selector */}
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: currentColors.text, fontSize: isTablet ? 42 : 34 }]}>
            {language === 'mn' ? 'Хот' : 'Cities'}
          </Text>
          <Pressable 
            style={styles.citySelectorButton}
            onPress={() => setShowCitySelectorModal(true)}
          >
            <IconSymbol 
              name="chevron.down" 
              color={currentColors.primary} 
              size={isTablet ? 32 : 24} 
            />
          </Pressable>
        </View>
        
        <View style={styles.grid}>
          {orderedCities.map((city) => (
            <Pressable
              key={city.name}
              style={[styles.cityCard, { width: cardWidth }]}
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
                <Text style={[styles.cityName, { color: currentColors.text, fontSize: isTablet ? 20 : 17 }]}>
                  {t(city.nameKey)}
                </Text>
                <Text style={[styles.attractionCount, { color: currentColors.textSecondary, fontSize: isTablet ? 15 : 13 }]}>
                  {city.attractions.length} {t('attractions')}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* City Selector Modal */}
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
              <IconSymbol name="xmark" color={currentColors.textSecondary} size={isTablet ? 28 : 24} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
              {t('selectCity')}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Cities List */}
          <ScrollView 
            style={styles.citiesList}
            contentContainerStyle={[styles.citiesContent, { paddingHorizontal: isTablet ? 40 : 16 }]}
            showsVerticalScrollIndicator={false}
          >
            {orderedCities.map((city) => (
              <Pressable
                key={city.name}
                style={[
                  styles.citySelectCard, 
                  { 
                    backgroundColor: currentColors.backgroundSecondary,
                    borderColor: selectedCity.name === city.name ? currentColors.primary : 'transparent',
                    borderWidth: selectedCity.name === city.name ? 2 : 0,
                  }
                ]}
                onPress={() => handleCitySelect(city)}
              >
                <Image
                  source={{ uri: city.imageUrl }}
                  style={[styles.citySelectImage, { width: isTablet ? 100 : 80, height: isTablet ? 100 : 80, borderRadius: isTablet ? 16 : 12 }]}
                  resizeMode="cover"
                />
                <View style={styles.citySelectInfo}>
                  <Text style={[styles.citySelectName, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
                    {t(city.nameKey)}
                  </Text>
                  <Text style={[styles.citySelectProvince, { color: currentColors.textSecondary, fontSize: isTablet ? 17 : 14 }]}>
                    {t(city.provinceKey)}
                  </Text>
                </View>
                {selectedCity.name === city.name && (
                  <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={isTablet ? 36 : 28} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* City Attractions Modal */}
      <Modal
        visible={showCityModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: currentColors.background }]} edges={['top', 'bottom']}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: currentColors.separator }]}>
            <Pressable onPress={handleCloseModal} style={styles.backButton}>
              <IconSymbol name="chevron.left" color={currentColors.primary} size={isTablet ? 32 : 28} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: currentColors.text, fontSize: isTablet ? 24 : 20 }]}>
              {t(selectedCity?.nameKey)}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Search Bar */}
          <View style={[styles.searchSection, { paddingHorizontal: isTablet ? 40 : 16 }]}>
            <View style={[styles.searchContainer, { 
              backgroundColor: currentColors.backgroundSecondary,
              borderColor: currentColors.border 
            }]}>
              <IconSymbol name="magnifyingglass" color={currentColors.textSecondary} size={isTablet ? 24 : 20} />
              <TextInput
                style={[styles.searchInput, { color: currentColors.text, fontSize: isTablet ? 18 : 16 }]}
                placeholder={t('searchAttractions')}
                placeholderTextColor={currentColors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <IconSymbol name="xmark.circle.fill" color={currentColors.textSecondary} size={isTablet ? 24 : 20} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Attractions List */}
          <ScrollView 
            style={styles.attractionsList}
            contentContainerStyle={[styles.attractionsContent, { paddingHorizontal: isTablet ? 40 : 16 }]}
            showsVerticalScrollIndicator={false}
          >
            {filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction) => (
                <Pressable
                  key={attraction.id}
                  style={[styles.attractionCard, { backgroundColor: currentColors.backgroundSecondary }]}
                  onPress={() => console.log('Attraction pressed:', attraction.name)}
                >
                  <View style={[styles.attractionIcon, { backgroundColor: currentColors.primary + '15', width: isTablet ? 72 : 56, height: isTablet ? 72 : 56, borderRadius: isTablet ? 36 : 28 }]}>
                    <IconSymbol name="mappin.circle.fill" color={currentColors.primary} size={isTablet ? 36 : 28} />
                  </View>
                  <View style={styles.attractionInfo}>
                    <Text style={[styles.attractionName, { color: currentColors.text, fontSize: isTablet ? 22 : 18 }]}>
                      {attraction.name}
                    </Text>
                    <Text style={[styles.attractionCategory, { color: currentColors.textSecondary, fontSize: isTablet ? 16 : 13 }]}>
                      {attraction.category}
                    </Text>
                    <Text style={[styles.attractionDescription, { color: currentColors.textTertiary, fontSize: isTablet ? 16 : 13 }]}>
                      {attraction.description}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={isTablet ? 24 : 20} />
                </Pressable>
              ))
            ) : (
              <View style={styles.noResults}>
                <IconSymbol name="magnifyingglass" color={currentColors.textTertiary} size={isTablet ? 64 : 48} />
                <Text style={[styles.noResultsText, { color: currentColors.textSecondary, fontSize: isTablet ? 20 : 16 }]}>
                  {searchQuery ? t('noAttractionsFound') : t('noAttractionsAvailable')}
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: isTablet ? 32 : 24,
  },
  title: {
    fontWeight: '700',
    letterSpacing: -1,
  },
  citySelectorButton: {
    padding: 8,
    marginRight: -8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isTablet ? 20 : 16,
  },
  cityCard: {
    borderRadius: isTablet ? 20 : 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
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
    padding: isTablet ? 16 : 12,
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
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  modalTitle: {
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
    paddingVertical: isTablet ? 24 : 16,
    paddingBottom: 20,
  },
  citySelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 12,
    borderRadius: isTablet ? 20 : 16,
    marginBottom: isTablet ? 16 : 12,
    gap: isTablet ? 16 : 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  citySelectImage: {},
  citySelectInfo: {
    flex: 1,
  },
  citySelectName: {
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  citySelectProvince: {
    fontWeight: '500',
  },
  searchSection: {
    paddingVertical: isTablet ? 16 : 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: isTablet ? 16 : 12,
    borderWidth: 1,
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 14 : 10,
    gap: isTablet ? 12 : 8,
  },
  searchInput: {
    flex: 1,
    fontWeight: '400',
  },
  attractionsList: {
    flex: 1,
  },
  attractionsContent: {
    paddingBottom: 20,
  },
  attractionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
    borderRadius: isTablet ? 20 : 16,
    marginBottom: isTablet ? 16 : 12,
    gap: isTablet ? 16 : 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  attractionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  attractionInfo: {
    flex: 1,
  },
  attractionName: {
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  attractionCategory: {
    fontWeight: '500',
    marginBottom: 2,
  },
  attractionDescription: {
    fontWeight: '400',
    lineHeight: isTablet ? 22 : 18,
  },
  noResults: {
    paddingVertical: isTablet ? 80 : 60,
    alignItems: 'center',
    gap: isTablet ? 20 : 16,
  },
  noResultsText: {
    fontWeight: '500',
  },
});
