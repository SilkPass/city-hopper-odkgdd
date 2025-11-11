
import React, { useState } from 'react';
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
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    attractions: [
      { id: '5', name: 'The Bund', category: 'Scenic Spot', description: 'Waterfront promenade' },
      { id: '6', name: 'Yu Garden', category: 'Cultural Landmark', description: 'Classical Chinese garden' },
      { id: '7', name: 'Oriental Pearl Tower', category: 'Modern Attraction', description: 'Iconic TV tower' },
    ],
  },
  {
    name: 'Hong Kong',
    imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80',
    attractions: [
      { id: '8', name: 'Victoria Harbour', category: 'Scenic Spot', description: 'Natural harbor' },
      { id: '9', name: 'Victoria Peak', category: 'Scenic Spot', description: 'Mountain peak with views' },
      { id: '10', name: 'Temple Street', category: 'Cultural Landmark', description: 'Night market' },
    ],
  },
  {
    name: 'Guangzhou',
    imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=800&q=80',
    attractions: [
      { id: '11', name: 'Canton Tower', category: 'Modern Attraction', description: 'Observation tower' },
      { id: '12', name: 'Chen Clan Ancestral Hall', category: 'Cultural Landmark', description: 'Traditional architecture' },
    ],
  },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function CitiesScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCityPress = (city: City) => {
    console.log('City pressed:', city.name);
    setSelectedCity(city);
    setShowCityModal(true);
  };

  const handleCloseModal = () => {
    setShowCityModal(false);
    setSearchQuery('');
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
        <Text style={[styles.title, { color: currentColors.text }]}>
          {t('cities')}
        </Text>
        
        <View style={styles.grid}>
          {CITIES.map((city) => (
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
                  {city.name}
                </Text>
                <Text style={[styles.attractionCount, { color: currentColors.textSecondary }]}>
                  {city.attractions.length} attractions
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

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
              {selectedCity?.name}
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
                placeholder="Search attractions..."
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
                  {searchQuery ? 'No attractions found' : 'No attractions available'}
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
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -1,
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
