
import { useRouter, usePathname } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import React from 'react';
import { BlurView } from 'expo-blur';
import { colors, darkColors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

export interface TabBarItem {
  route: string;
  label: string;
  icon: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab index based on current pathname
  const getActiveIndex = () => {
    console.log('Current pathname:', pathname);
    
    // Check each tab route
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      
      // Home route matching
      if (tab.route === '/(tabs)/(home)') {
        if (pathname.includes('/(home)') || pathname === '/(tabs)') {
          console.log('Matched home tab, index:', i);
          return i;
        }
      }
      // Cities route matching
      else if (tab.route === '/(tabs)/cities') {
        if (pathname.includes('/cities')) {
          console.log('Matched cities tab, index:', i);
          return i;
        }
      }
      // Profile route matching
      else if (tab.route === '/(tabs)/profile') {
        if (pathname.includes('/profile')) {
          console.log('Matched profile tab, index:', i);
          return i;
        }
      }
    }
    
    console.log('No match found, defaulting to index 0');
    return 0;
  };

  const activeIndex = getActiveIndex();

  const indicatorPosition = useSharedValue(activeIndex);

  React.useEffect(() => {
    console.log('Active index changed to:', activeIndex);
    indicatorPosition.value = withSpring(activeIndex, {
      damping: 20,
      stiffness: 200,
    });
  }, [activeIndex, indicatorPosition]);

  const handleTabPress = (route: string, index: number) => {
    console.log('Tab pressed, navigating to:', route, 'index:', index);
    
    // Use replace for smoother navigation without animation
    try {
      router.replace(route as any);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to push if replace fails
      router.push(route as any);
    }
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            indicatorPosition.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
      width: tabWidth,
    };
  });

  const tabWidth = containerWidth / tabs.length;

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.safeArea,
        {
          bottom: bottomMargin,
        },
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 100}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius: borderRadius,
            backgroundColor: isDark 
              ? 'rgba(26, 26, 26, 0.85)' 
              : 'rgba(255, 255, 255, 0.85)',
            borderColor: isDark ? darkColors.border : colors.border,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.indicator,
            animatedIndicatorStyle,
            {
              backgroundColor: currentColors.primary + '20',
            },
          ]}
        />

        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          const iconColor = isActive ? currentColors.primary : currentColors.textSecondary;

          return (
            <TouchableOpacity
              key={tab.route}
              style={[styles.tab, { width: tabWidth }]}
              onPress={() => handleTabPress(tab.route, index)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={iconColor}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: iconColor,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
    elevation: 8,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    height: '80%',
    borderRadius: 16,
    top: '10%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
});
