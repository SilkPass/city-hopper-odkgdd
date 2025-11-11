
import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors, darkColors } from '@/styles/commonStyles';
import { useThemeMode } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { isDark } = useThemeMode();
  const currentColors = isDark ? darkColors : colors;

  // Define the tabs configuration with correct routes
  const tabs: TabBarItem[] = [
    {
      route: '/(tabs)/(home)',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      route: '/(tabs)/cities',
      icon: 'building.2.fill',
      label: 'Cities',
    },
    {
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={() => <FloatingTabBar tabs={tabs} />}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="cities"
          options={{
            title: 'Cities',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
