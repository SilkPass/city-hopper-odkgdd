
import React from 'react';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors, darkColors } from '@/styles/commonStyles';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useThemeMode } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { isDark } = useThemeMode();
  const currentColors = isDark ? darkColors : colors;

  const tabs: TabBarItem[] = [
    {
      route: '/(tabs)/(home)',
      label: 'Home',
      labelKey: 'home',
      icon: 'house.fill',
    },
    {
      route: '/(tabs)/cities',
      label: 'Cities',
      labelKey: 'cities',
      icon: 'building.2.fill',
    },
    {
      route: '/(tabs)/profile',
      label: 'Profile',
      labelKey: 'profile',
      icon: 'person.fill',
    },
  ];

  return (
    <>
      <Tabs
        tabBar={(props) => <FloatingTabBar tabs={tabs} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: currentColors.background,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            headerShown: Platform.OS === 'ios',
          }}
        />
        <Tabs.Screen
          name="cities"
          options={{
            title: 'Cities',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
    </>
  );
}
