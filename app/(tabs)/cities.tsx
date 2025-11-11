
import React from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';

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
    imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80',
  },
];

export default function CitiesScreen() {
  const theme = useTheme();
  const isDark = theme.dark;
  const screenWidth = Dimensions.get('window').width;
  const padding = 20;
  const gap = 16;
  const itemWidth = (screenWidth - padding * 2 - gap) / 2;

  const handleCityPress = (cityName: string) => {
    console.log('City pressed:', cityName);
    // You can add navigation or other actions here
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : colors.background },
      ]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#FFFFFF' : colors.text },
            ]}
          >
            Cities
          </Text>
        </View>

        {/* Grid Container */}
        <View style={[styles.gridContainer, { padding }]}>
          {CITIES.map((city, index) => (
            <Pressable
              key={city.name}
              style={[
                styles.cityItem,
                {
                  width: itemWidth,
                  marginRight: index % 2 === 0 ? gap : 0,
                  marginBottom: gap,
                },
              ]}
              onPress={() => handleCityPress(city.name)}
            >
              {/* City Image */}
              <View
                style={[
                  styles.imageContainer,
                  {
                    width: itemWidth,
                    height: itemWidth,
                  },
                ]}
              >
                <Image
                  source={{ uri: city.imageUrl }}
                  style={styles.cityImage}
                  resizeMode="cover"
                />
              </View>

              {/* City Name */}
              <Text
                style={[
                  styles.cityName,
                  { color: isDark ? '#FFFFFF' : colors.text },
                ]}
                numberOfLines={1}
              >
                {city.name}
              </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating tab bar
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
    }),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cityItem: {
    marginBottom: 8,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E5EA',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  cityName: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: -0.2,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
    }),
  },
});
