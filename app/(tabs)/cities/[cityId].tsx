
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
  Platform,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const CARD_SPACING = 16;

interface City {
  name: string;
  nameKey: string;
  imageUrl: string;
  attractions: CardItem[];
  foodAndDrinks: CardItem[];
  provinceKey: string;
}

interface CardItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

const CITIES: City[] = [
  {
    name: 'Beijing',
    nameKey: 'beijing',
    provinceKey: 'beijingProvince',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    attractions: [
      { 
        id: '1', 
        name: 'Forbidden City', 
        imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
        description: 'Imperial palace complex from Ming dynasty'
      },
      { 
        id: '2', 
        name: 'Summer Palace', 
        imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=600&q=80',
        description: 'Royal garden and palace retreat'
      },
      { 
        id: '3', 
        name: 'Great Wall', 
        imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
        description: 'Ancient fortification wonder'
      },
    ],
    foodAndDrinks: [
      { 
        id: 'f1', 
        name: 'Peking Duck', 
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80',
        description: 'Famous roasted duck dish'
      },
      { 
        id: 'f2', 
        name: 'Jiaozi Dumplings', 
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
        description: 'Traditional Chinese dumplings'
      },
      { 
        id: 'f3', 
        name: 'Hot Pot', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Spicy communal dining experience'
      },
    ],
  },
  {
    name: 'Shanghai',
    nameKey: 'shanghai',
    provinceKey: 'shanghaiProvince',
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    attractions: [
      { 
        id: '8', 
        name: 'The Bund', 
        imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&q=80',
        description: 'Waterfront promenade with skyline views'
      },
      { 
        id: '9', 
        name: 'Yu Garden', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Classical Chinese garden oasis'
      },
      { 
        id: '10', 
        name: 'Oriental Pearl Tower', 
        imageUrl: 'https://images.unsplash.com/photo-1537981576259-a1a7d8a97a1f?w=600&q=80',
        description: 'Iconic futuristic TV tower'
      },
    ],
    foodAndDrinks: [
      { 
        id: 'f4', 
        name: 'Xiaolongbao', 
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
        description: 'Soup-filled steamed buns'
      },
      { 
        id: 'f5', 
        name: 'Shengjianbao', 
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
        description: 'Pan-fried pork buns'
      },
      { 
        id: 'f6', 
        name: 'Hairy Crab', 
        imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80',
        description: 'Seasonal delicacy from Yangcheng Lake'
      },
    ],
  },
  {
    name: 'Hong Kong',
    nameKey: 'hongKong',
    provinceKey: 'hongKongProvince',
    imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80',
    attractions: [
      { 
        id: '14', 
        name: 'Victoria Harbour', 
        imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&q=80',
        description: 'Natural harbor with stunning views'
      },
      { 
        id: '15', 
        name: 'Victoria Peak', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Mountain peak with panoramic views'
      },
      { 
        id: '16', 
        name: 'Temple Street', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Vibrant night market'
      },
    ],
    foodAndDrinks: [
      { 
        id: 'f7', 
        name: 'Dim Sum', 
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
        description: 'Traditional Cantonese small plates'
      },
      { 
        id: 'f8', 
        name: 'Egg Tarts', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Portuguese-style custard tarts'
      },
      { 
        id: 'f9', 
        name: 'Milk Tea', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Signature Hong Kong-style tea'
      },
    ],
  },
  {
    name: 'Macao',
    nameKey: 'macao',
    provinceKey: 'macaoProvince',
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
    attractions: [
      { 
        id: '17', 
        name: 'Ruins of St. Paul', 
        imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
        description: 'Historic church facade'
      },
      { 
        id: '18', 
        name: 'Senado Square', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Historic Portuguese-style square'
      },
      { 
        id: '19', 
        name: 'A-Ma Temple', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Ancient Chinese temple'
      },
    ],
    foodAndDrinks: [
      { 
        id: 'f10', 
        name: 'Portuguese Egg Tart', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Authentic Portuguese pastry'
      },
      { 
        id: 'f11', 
        name: 'African Chicken', 
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',
        description: 'Spicy Macanese fusion dish'
      },
      { 
        id: 'f12', 
        name: 'Pork Chop Bun', 
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
        description: 'Crispy pork in fresh bun'
      },
    ],
  },
  {
    name: 'Hohhot',
    nameKey: 'hohhot',
    provinceKey: 'hohhotProvince',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    attractions: [
      { 
        id: '5', 
        name: 'Dazhao Temple', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Historic Buddhist temple'
      },
      { 
        id: '6', 
        name: 'Inner Mongolia Museum', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Regional history and culture'
      },
      { 
        id: '7', 
        name: 'Zhaojun Tomb', 
        imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=600&q=80',
        description: 'Ancient burial site'
      },
    ],
    foodAndDrinks: [
      { 
        id: 'f13', 
        name: 'Mongolian Hot Pot', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Traditional lamb hot pot'
      },
      { 
        id: 'f14', 
        name: 'Milk Tea', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Authentic Mongolian milk tea'
      },
      { 
        id: 'f15', 
        name: 'Roasted Lamb', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'Grilled lamb skewers'
      },
    ],
  },
  {
    name: 'Ordos',
    nameKey: 'ordos',
    provinceKey: 'ordosProvince',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    attractions: [
      { 
        id: '11', 
        name: 'Genghis Khan Mausoleum', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Memorial complex for the great khan'
      },
      { 
        id: '12', 
        name: 'Resonant Sand Gorge', 
        imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
        description: 'Desert landscape with singing sands'
      },
      { 
        id: '13', 
        name: 'Ordos Museum', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Modern architecture museum'
      },
    ],
    foodAndDrinks: [
      { 
        id: 'f16', 
        name: 'Hand-Pulled Mutton', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'Traditional Mongolian dish'
      },
      { 
        id: 'f17', 
        name: 'Cheese Curds', 
        imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80',
        description: 'Mongolian dairy specialty'
      },
      { 
        id: 'f18', 
        name: 'Airag', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Fermented mare&apos;s milk'
      },
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

  const renderCard = (item: CardItem) => (
    <Pressable
      key={item.id}
      style={[styles.card, { backgroundColor: currentColors.backgroundSecondary }]}
      onPress={() => console.log('Card pressed:', item.name)}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: currentColors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.cardDescription, { color: currentColors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </Pressable>
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
        {/* City Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.cityName, { color: currentColors.text }]}>
            {t(city.nameKey)}
          </Text>
        </View>

        {/* Attractions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('attractions')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            snapToAlignment="start"
          >
            {city.attractions.map((item) => renderCard(item))}
          </ScrollView>
        </View>

        {/* Food & Drinks Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('foodAndDrinks')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            snapToAlignment="start"
          >
            {city.foodAndDrinks.map((item) => renderCard(item))}
          </ScrollView>
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
    paddingBottom: Platform.OS === 'android' ? 100 : 120,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 24,
  },
  cityName: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
    letterSpacing: -0.8,
  },
  horizontalScrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: CARD_SPACING,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#E0E0E0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  cardDescription: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
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
