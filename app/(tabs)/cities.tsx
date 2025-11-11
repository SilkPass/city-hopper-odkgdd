
import React from 'react';
import { colors, darkColors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';

interface City {
  name: string;
  imageUrl: string;
}

const CITIES: City[] = [
  {
    name: 'Beijing',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
  },
  {
    name: 'Shanghai',
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
  },
  {
    name: 'Hong Kong',
    imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80',
  },
  {
    name: 'Macao',
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
  },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function CitiesScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;

  const handleCityPress = (cityName: string) => {
    console.log('City pressed:', cityName);
  };

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
          {CITIES.map((city, index) => (
            <Pressable
              key={city.name}
              style={[styles.cityCard, { width: cardWidth }]}
              onPress={() => handleCityPress(city.name)}
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
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
    borderRadius: 12,
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
  },
});
