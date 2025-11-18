
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
      { 
        id: '4', 
        name: 'Temple of Heaven', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Imperial temple complex'
      },
      { 
        id: '5', 
        name: 'Beihai Park', 
        imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=600&q=80',
        description: 'Historic imperial garden'
      },
      { 
        id: '6', 
        name: 'Lama Temple', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Tibetan Buddhist monastery'
      },
      { 
        id: '7', 
        name: 'Jingshan Park', 
        imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=600&q=80',
        description: 'Park with panoramic city views'
      },
      { 
        id: '8', 
        name: 'Nanluoguxiang', 
        imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
        description: 'Historic hutong alley'
      },
      { 
        id: '9', 
        name: 'Beijing National Stadium', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Iconic Bird\'s Nest stadium'
      },
      { 
        id: '10', 
        name: 'Tiananmen Square', 
        imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
        description: 'Historic city square'
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
      { 
        id: 'f4', 
        name: 'Zhajiangmian', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Noodles with soybean paste'
      },
      { 
        id: 'f5', 
        name: 'Lamb Skewers', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'Grilled lamb on sticks'
      },
      { 
        id: 'f6', 
        name: 'Tanghulu', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Candied fruit on a stick'
      },
      { 
        id: 'f7', 
        name: 'Beijing Yogurt', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Traditional fermented yogurt'
      },
      { 
        id: 'f8', 
        name: 'Baozi', 
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
        description: 'Steamed filled buns'
      },
      { 
        id: 'f9', 
        name: 'Jianbing', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Savory breakfast crepe'
      },
      { 
        id: 'f10', 
        name: 'Douzhi', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Fermented mung bean drink'
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
      { 
        id: '11', 
        name: 'Shanghai Tower', 
        imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&q=80',
        description: 'Tallest building in China'
      },
      { 
        id: '12', 
        name: 'Nanjing Road', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Famous shopping street'
      },
      { 
        id: '13', 
        name: 'Tianzifang', 
        imageUrl: 'https://images.unsplash.com/photo-1537981576259-a1a7d8a97a1f?w=600&q=80',
        description: 'Artsy shopping district'
      },
      { 
        id: '14', 
        name: 'Jade Buddha Temple', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Buddhist temple with jade statues'
      },
      { 
        id: '15', 
        name: 'Shanghai Museum', 
        imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&q=80',
        description: 'Ancient Chinese art museum'
      },
      { 
        id: '16', 
        name: 'Xintiandi', 
        imageUrl: 'https://images.unsplash.com/photo-1537981576259-a1a7d8a97a1f?w=600&q=80',
        description: 'Trendy entertainment district'
      },
      { 
        id: '17', 
        name: 'Zhujiajiao Water Town', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Ancient water town'
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
      { 
        id: 'f7', 
        name: 'Scallion Oil Noodles', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Simple but flavorful noodles'
      },
      { 
        id: 'f8', 
        name: 'Sweet and Sour Ribs', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'Classic Shanghai dish'
      },
      { 
        id: 'f9', 
        name: 'Lion\'s Head Meatballs', 
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80',
        description: 'Large braised pork meatballs'
      },
      { 
        id: 'f10', 
        name: 'Drunken Chicken', 
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',
        description: 'Chicken marinated in wine'
      },
      { 
        id: 'f11', 
        name: 'Stinky Tofu', 
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
        description: 'Fermented tofu snack'
      },
      { 
        id: 'f12', 
        name: 'Red Bean Soup', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Sweet dessert soup'
      },
      { 
        id: 'f13', 
        name: 'Crab Shell Pastry', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Flaky pastry with filling'
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
      { 
        id: '17', 
        name: 'Tian Tan Buddha', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Giant bronze Buddha statue'
      },
      { 
        id: '18', 
        name: 'Star Ferry', 
        imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&q=80',
        description: 'Historic harbor ferry'
      },
      { 
        id: '19', 
        name: 'Tsim Sha Tsui', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Shopping and dining district'
      },
      { 
        id: '20', 
        name: 'Ocean Park', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Marine theme park'
      },
      { 
        id: '21', 
        name: 'Lantau Island', 
        imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&q=80',
        description: 'Largest island in Hong Kong'
      },
      { 
        id: '22', 
        name: 'Mong Kok', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Bustling shopping area'
      },
      { 
        id: '23', 
        name: 'Wong Tai Sin Temple', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Famous Taoist temple'
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
      { 
        id: 'f10', 
        name: 'Roast Goose', 
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80',
        description: 'Crispy roasted goose'
      },
      { 
        id: 'f11', 
        name: 'Wonton Noodles', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Noodles with shrimp dumplings'
      },
      { 
        id: 'f12', 
        name: 'Pineapple Bun', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Sweet bread with crispy top'
      },
      { 
        id: 'f13', 
        name: 'Char Siu', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'BBQ pork'
      },
      { 
        id: 'f14', 
        name: 'Fish Balls', 
        imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80',
        description: 'Street food favorite'
      },
      { 
        id: 'f15', 
        name: 'Egg Waffle', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Bubble-shaped waffle'
      },
      { 
        id: 'f16', 
        name: 'Congee', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Rice porridge'
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
      { 
        id: '20', 
        name: 'Macau Tower', 
        imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
        description: 'Observation and adventure tower'
      },
      { 
        id: '21', 
        name: 'Fisherman\'s Wharf', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Themed entertainment complex'
      },
      { 
        id: '22', 
        name: 'Guia Fortress', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Historic military fort'
      },
      { 
        id: '23', 
        name: 'Taipa Village', 
        imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
        description: 'Traditional Portuguese village'
      },
      { 
        id: '24', 
        name: 'Cotai Strip', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Casino and resort area'
      },
      { 
        id: '25', 
        name: 'Coloane Island', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Peaceful island retreat'
      },
      { 
        id: '26', 
        name: 'Mandarin\'s House', 
        imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
        description: 'Historic Chinese residence'
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
      { 
        id: 'f13', 
        name: 'Minchi', 
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80',
        description: 'Minced meat with potatoes'
      },
      { 
        id: 'f14', 
        name: 'Bacalhau', 
        imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80',
        description: 'Portuguese salted cod'
      },
      { 
        id: 'f15', 
        name: 'Serradura', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Sawdust pudding dessert'
      },
      { 
        id: 'f16', 
        name: 'Almond Cookies', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Traditional Macanese cookies'
      },
      { 
        id: 'f17', 
        name: 'Caldo Verde', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Portuguese green soup'
      },
      { 
        id: 'f18', 
        name: 'Galinha à Portuguesa', 
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',
        description: 'Portuguese-style chicken'
      },
      { 
        id: 'f19', 
        name: 'Bebinca', 
        imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80',
        description: 'Layered coconut dessert'
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
      { 
        id: '8', 
        name: 'Xilituzhao Temple', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Tibetan Buddhist temple'
      },
      { 
        id: '9', 
        name: 'Five Pagoda Temple', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Temple with five pagodas'
      },
      { 
        id: '10', 
        name: 'Gegentala Grassland', 
        imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=600&q=80',
        description: 'Vast grassland landscape'
      },
      { 
        id: '11', 
        name: 'Huitengxile Grassland', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Scenic grassland area'
      },
      { 
        id: '12', 
        name: 'Qingcheng Park', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Urban park with lake'
      },
      { 
        id: '13', 
        name: 'Great Mosque', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Historic Islamic mosque'
      },
      { 
        id: '14', 
        name: 'Wanbu Huayanjing Pagoda', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Ancient Buddhist pagoda'
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
      { 
        id: 'f16', 
        name: 'Shaomai', 
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
        description: 'Steamed dumplings'
      },
      { 
        id: 'f17', 
        name: 'Beef Jerky', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'Dried seasoned beef'
      },
      { 
        id: 'f18', 
        name: 'Cheese', 
        imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80',
        description: 'Mongolian dairy cheese'
      },
      { 
        id: 'f19', 
        name: 'Yogurt', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Fresh Mongolian yogurt'
      },
      { 
        id: 'f20', 
        name: 'Buuz', 
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
        description: 'Steamed meat dumplings'
      },
      { 
        id: 'f21', 
        name: 'Khuushuur', 
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80',
        description: 'Fried meat pastry'
      },
      { 
        id: 'f22', 
        name: 'Airag', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Fermented mare\'s milk'
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
      { 
        id: '14', 
        name: 'Kubuqi Desert', 
        imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
        description: 'Vast desert landscape'
      },
      { 
        id: '15', 
        name: 'Mausoleum of Genghis Khan', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Historic memorial site'
      },
      { 
        id: '16', 
        name: 'Ordos Grassland', 
        imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=600&q=80',
        description: 'Beautiful grassland scenery'
      },
      { 
        id: '17', 
        name: 'Kangbashi New District', 
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        description: 'Modern urban development'
      },
      { 
        id: '18', 
        name: 'Erdos Wildlife Park', 
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
        description: 'Wildlife conservation park'
      },
      { 
        id: '19', 
        name: 'Nadam Fair', 
        imageUrl: 'https://images.unsplash.com/photo-1570797197190-8e003a00c846?w=600&q=80',
        description: 'Traditional Mongolian festival'
      },
      { 
        id: '20', 
        name: 'Xiansha Bay', 
        imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
        description: 'Desert resort area'
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
        description: 'Fermented mare\'s milk'
      },
      { 
        id: 'f19', 
        name: 'Roasted Whole Lamb', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'Ceremonial roasted lamb'
      },
      { 
        id: 'f20', 
        name: 'Milk Tofu', 
        imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80',
        description: 'Dried milk curd'
      },
      { 
        id: 'f21', 
        name: 'Mongolian Milk Tea', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Salty milk tea'
      },
      { 
        id: 'f22', 
        name: 'Lamb Soup', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Hearty lamb broth'
      },
      { 
        id: 'f23', 
        name: 'Fried Rice', 
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        description: 'Mongolian-style fried rice'
      },
      { 
        id: 'f24', 
        name: 'Dried Meat', 
        imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
        description: 'Preserved meat snack'
      },
      { 
        id: 'f25', 
        name: 'Butter Tea', 
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        description: 'Traditional butter tea'
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
            headerShown: false,
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

  // Calculate card dimensions to match cities page
  const horizontalPadding = 16;
  const availableWidth = SCREEN_WIDTH - (horizontalPadding * 2);
  const numColumns = 2;
  const gap = 20;
  const totalGapWidth = gap * (numColumns - 1);
  const cardWidth = (availableWidth - totalGapWidth) / numColumns;

  const renderCard = (item: CardItem) => (
    <Pressable
      key={item.id}
      style={[styles.card, { 
        width: cardWidth,
        backgroundColor: currentColors.backgroundSecondary 
      }]}
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
          headerShown: false,
        }}
      />
      
      {/* Custom Header with Close Button */}
      <View style={[styles.header, { borderBottomColor: currentColors.separator }]}>
        <View style={styles.headerLeft} />
        <Text style={[styles.headerTitle, { color: currentColors.text }]} numberOfLines={1}>
          {t(city.nameKey)}
        </Text>
        <Pressable 
          style={styles.closeButton}
          onPress={() => {
            console.log('Close button pressed, navigating back to cities');
            router.back();
          }}
        >
          <IconSymbol 
            name="xmark" 
            color={currentColors.text} 
            size={24} 
          />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Attractions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('attractions')}
          </Text>
          <View style={[styles.grid, { gap: gap, paddingHorizontal: horizontalPadding }]}>
            {city.attractions.map((item) => renderCard(item))}
          </View>
        </View>

        {/* Food & Drinks Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {t('foodAndDrinks')}
          </Text>
          <View style={[styles.grid, { gap: gap, paddingHorizontal: horizontalPadding }]}>
            {city.foodAndDrinks.map((item) => renderCard(item))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 100 : 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 16,
    letterSpacing: -0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    marginBottom: 20,
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E0E0E0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 16,
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
