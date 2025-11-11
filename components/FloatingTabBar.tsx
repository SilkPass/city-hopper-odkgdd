
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
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

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
  const activeIndex = tabs.findIndex((tab) => {
    // Normalize paths for comparison
    const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const normalizedTabRoute = tab.route.endsWith('/') ? tab.route.slice(0, -1) : tab.route;
    
    // Check for home route
    if (normalizedTabRoute === '/(tabs)/(home)') {
      return normalizedPathname === '/(tabs)/(home)' || normalizedPathname === '/(tabs)/(home)/index';
    }
    
    // Check for cities route
    if (normalizedTabRoute === '/(tabs)/cities') {
      return normalizedPathname === '/(tabs)/cities';
    }
    
    // Check for profile route
    if (normalizedTabRoute === '/(tabs)/profile') {
      return normalizedPathname === '/(tabs)/profile';
    }
    
    return false;
  });

  const indicatorPosition = useSharedValue(activeIndex >= 0 ? activeIndex : 0);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  React.useEffect(() => {
    if (activeIndex >= 0) {
      indicatorPosition.value = withSpring(activeIndex, {
        damping: 20,
        stiffness: 200,
      });
    }
  }, [activeIndex, indicatorPosition]);

  const handleTabPress = (route: string) => {
    console.log('Tab pressed, navigating to:', route);
    router.push(route as any);
  };

  const navigateToTab = (index: number) => {
    if (index >= 0 && index < tabs.length) {
      console.log('Swiping to tab:', tabs[index].label);
      handleTabPress(tabs[index].route);
    }
  };

  // Pan gesture for swipe navigation
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
    })
    .onEnd((event) => {
      const threshold = 50; // Minimum swipe distance
      const velocity = event.velocityX;
      
      // Determine if swipe was significant enough
      if (Math.abs(event.translationX) > threshold || Math.abs(velocity) > 500) {
        let newIndex = activeIndex;
        
        // Swipe right (go to previous tab)
        if (event.translationX > 0 && activeIndex > 0) {
          newIndex = activeIndex - 1;
        }
        // Swipe left (go to next tab)
        else if (event.translationX < 0 && activeIndex < tabs.length - 1) {
          newIndex = activeIndex + 1;
        }
        
        if (newIndex !== activeIndex) {
          runOnJS(navigateToTab)(newIndex);
        }
      }
      
      // Reset translation
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
    });

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
      <GestureDetector gesture={panGesture}>
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
                onPress={() => handleTabPress(tab.route)}
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
      </GestureDetector>
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
