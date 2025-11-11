
import { useRouter, usePathname } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useEffect, useMemo } from 'react';
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
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface TabBarItem {
  route: string;
  label: string;
  labelKey: string;
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
  borderRadius = 28,
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
      // Services route matching
      else if (tab.route === '/(tabs)/services') {
        if (pathname.includes('/services')) {
          console.log('Matched services tab, index:', i);
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

  // Shared values for animations - create them at the top level, not in a callback
  const indicatorPosition = useSharedValue(activeIndex);
  
  // Create shared values for each tab dynamically based on tabs length
  // Fixed: Move useSharedValue calls outside of the map callback
  const tabPressScale = useMemo(() => {
    const scales = [];
    for (let i = 0; i < tabs.length; i++) {
      scales.push(useSharedValue(1));
    }
    return scales;
  }, [tabs]);
  
  const tabPressOpacity = useMemo(() => {
    const opacities = [];
    for (let i = 0; i < tabs.length; i++) {
      opacities.push(useSharedValue(1));
    }
    return opacities;
  }, [tabs]);

  useEffect(() => {
    console.log('Active index changed to:', activeIndex);
    // Smooth spring animation for indicator
    indicatorPosition.value = withSpring(activeIndex, {
      damping: 25,
      stiffness: 300,
      mass: 0.8,
    });
  }, [activeIndex, indicatorPosition]);

  const triggerHapticFeedback = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.selectionAsync();
    }
  };

  const handleTabPress = (route: string, index: number) => {
    console.log('Tab pressed, navigating to:', route, 'index:', index);
    
    // Trigger haptic feedback
    triggerHapticFeedback();
    
    // Animate tab press
    if (tabPressScale[index]) {
      tabPressScale[index].value = withSpring(0.85, {
        damping: 15,
        stiffness: 400,
      }, () => {
        tabPressScale[index].value = withSpring(1, {
          damping: 15,
          stiffness: 400,
        });
      });
    }

    // Navigate with smooth transition
    try {
      router.replace(route as any);
    } catch (error) {
      console.error('Navigation error:', error);
      router.push(route as any);
    }
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    const padding = 6;
    
    return {
      transform: [
        {
          translateX: interpolate(
            indicatorPosition.value,
            tabs.map((_, i) => i),
            tabs.map((_, i) => (tabWidth * i) + padding)
          ),
        },
      ],
      width: tabWidth - (padding * 2),
      opacity: withTiming(1, { duration: 200 }),
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
      pointerEvents="box-none"
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 95 : 100}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius: borderRadius,
            backgroundColor: isDark 
              ? 'rgba(28, 28, 30, 0.88)' 
              : 'rgba(255, 255, 255, 0.92)',
            borderColor: isDark 
              ? 'rgba(84, 84, 88, 0.36)' 
              : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        {/* Animated indicator background */}
        <Animated.View
          style={[
            styles.indicator,
            animatedIndicatorStyle,
            {
              backgroundColor: isDark
                ? 'rgba(255, 107, 138, 0.15)'
                : 'rgba(220, 20, 60, 0.12)',
            },
          ]}
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <TabButton
              key={tab.route}
              tab={tab}
              index={index}
              isActive={isActive}
              tabWidth={tabWidth}
              currentColors={currentColors}
              isDark={isDark}
              onPress={handleTabPress}
              pressScale={tabPressScale[index]}
              pressOpacity={tabPressOpacity[index]}
              t={t}
            />
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

// Separate component for individual tab buttons with optimized animations
interface TabButtonProps {
  tab: TabBarItem;
  index: number;
  isActive: boolean;
  tabWidth: number;
  currentColors: typeof colors;
  isDark: boolean;
  onPress: (route: string, index: number) => void;
  pressScale: Animated.SharedValue<number>;
  pressOpacity: Animated.SharedValue<number>;
  t: (key: string) => string;
}

const TabButton = React.memo(({
  tab,
  index,
  isActive,
  tabWidth,
  currentColors,
  isDark,
  onPress,
  pressScale,
  pressOpacity,
  t,
}: TabButtonProps) => {
  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Bounce animation when tab becomes active
      iconScale.value = withSpring(1.15, {
        damping: 12,
        stiffness: 300,
      }, () => {
        iconScale.value = withSpring(1, {
          damping: 15,
          stiffness: 400,
        });
      });

      // Subtle rotation for active state
      iconRotate.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
    } else {
      iconScale.value = withSpring(1, {
        damping: 15,
        stiffness: 400,
      });
      iconRotate.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
    }
  }, [isActive, iconScale, iconRotate]);

  const animatedTabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pressScale.value },
      ],
      opacity: pressOpacity.value,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScale.value },
        { rotate: `${iconRotate.value}deg` },
      ],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0.6, { duration: 200 }),
      transform: [
        {
          translateY: withSpring(isActive ? 0 : 1, {
            damping: 20,
            stiffness: 300,
          }),
        },
      ],
    };
  });

  const iconColor = isActive 
    ? currentColors.primary 
    : isDark 
      ? 'rgba(235, 235, 245, 0.6)' 
      : 'rgba(60, 60, 67, 0.6)';

  return (
    <Pressable
      style={[styles.tab, { width: tabWidth }]}
      onPress={() => onPress(tab.route, index)}
      onPressIn={() => {
        pressScale.value = withSpring(0.9, {
          damping: 15,
          stiffness: 400,
        });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, {
          damping: 15,
          stiffness: 400,
        });
      }}
    >
      <Animated.View style={[styles.tabContent, animatedTabStyle]}>
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <IconSymbol
            name={tab.icon as any}
            size={26}
            color={iconColor}
          />
        </Animated.View>
        <Animated.Text
          style={[
            styles.label,
            animatedLabelStyle,
            {
              color: iconColor,
              fontWeight: isActive ? '600' : '500',
            },
          ]}
        >
          {t(tab.labelKey)}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
});

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
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: Platform.select({
      ios: '0px 8px 24px rgba(0, 0, 0, 0.15)',
      android: '0px 4px 16px rgba(0, 0, 0, 0.18)',
      default: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    }),
    elevation: 12,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    height: '85%',
    borderRadius: 20,
    top: '7.5%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
});
