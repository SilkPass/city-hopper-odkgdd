
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
    imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80',
    attractions: [
      { id: '14', name: 'Victoria Harbour', category: 'Scenic Spot', description: 'Natural harbor' },
      { id: '15', name: 'Victoria Peak', category: 'Scenic Spot', description: 'Mountain peak with views' },
      { id: '16', name: 'Temple Street', category: 'Cultural Landmark', description: 'Night market' },
    ],
  },
  {
    name: 'Macau',
    nameKey: 'macau',
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
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    attractions: [
      { id: '11', name: 'Genghis Khan Mausoleum', category: 'Historical Site', description: 'Memorial complex' },
      { id: '12', name: 'Resonant Sand Gorge', category: 'Scenic Spot', description: 'Desert landscape' },
      { id: '13', name: 'Ordos Museum', category: 'Cultural Landmark', description: 'Modern architecture museum' },
    ],
  },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

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
      // Mongolian order: Beijing, Hohhot, Ordos, Shanghai, Hong Kong, Macau
      return [
        CITIES.find(c => c.nameKey === 'beijing')!,
        CITIES.find(c => c.nameKey === 'hohhot')!,
        CITIES.find(c => c.nameKey === 'ordos')!,
        CITIES.find(c => c.nameKey === 'shanghai')!,
        CITIES.find(c => c.nameKey === 'hongKong')!,
        CITIES.find(c => c.nameKey === 'macau')!,
      ];
    } else {
      // Default order: Beijing, Shanghai, Hong Kong, Macau, Hohhot, Ordos
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with City Selector */}
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: currentColors.text }]}>
            {language === 'mn' ? 'Хот' : 'Cities'}
          </Text>
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
                <Text style={[styles.cityName, { color: currentColors.text }]}>
                  {t(city.nameKey)}
                </Text>
                <Text style={[styles.attractionCount, { color: currentColors.textSecondary }]}>
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
                    borderColor: selectedCity.name === city.name ? currentColors.primary : 'transparent',
                    borderWidth: selectedCity.name === city.name ? 2 : 0,
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
                  <Text style={[styles.citySelectName, { color: currentColors.text }]}>
                    {t(city.nameKey)}
                  </Text>
                  <Text style={[styles.citySelectAttractions, { color: currentColors.textSecondary }]}>
                    {city.attractions.length} {t('attractions')}
                  </Text>
                </View>
                {selectedCity.name === city.name && (
                  <IconSymbol name="checkmark.circle.fill" color={currentColors.primary} size={28} />
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
              <IconSymbol name="chevron.left" color={currentColors.primary} size={28} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              {t(selectedCity?.nameKey)}
            </Text>
            <View style={styles.placeholder} />
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
          <ScrollView 
            style={styles.attractionsList}
            contentContainerStyle={styles.attractionsContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction) => (
                <Pressable
                  key={attraction.id}
                  style={[styles.attractionCard, { backgroundColor: currentColors.backgroundSecondary }]}
                  onPress={() => console.log('Attraction pressed:', attraction.name)}
                >
                  <View style={[styles.attractionIcon, { backgroundColor: currentColors.primary + '15' }]}>
                    <IconSymbol name="mappin.circle.fill" color={currentColors.primary} size={28} />
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
                  <IconSymbol name="chevron.right" color={currentColors.textTertiary} size={20} />
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
    paddingHorizontal: 16,
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
    fontSize: 34,
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
    gap: 16,
  },
  cityCard: {
    borderRadius: 16,
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
    padding: 12,
  },
  cityName: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  attractionCount: {
    fontSize: 13,
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
  citySelectAttractions: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  attractionsList: {
    flex: 1,
  },
  attractionsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  attractionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  attractionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attractionInfo: {
    flex: 1,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  attractionCategory: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  attractionDescription: {
    fontSize: 13,
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
  },
});
