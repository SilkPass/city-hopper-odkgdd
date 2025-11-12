
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function FloatingTabBar({
  tabs,
  containerWidth = isTablet ? Math.min(screenWidth - 64, 600) : screenWidth - 32,
  borderRadius = 28,
  bottomMargin,
}: FloatingTabBarProps) {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : colors;
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Calculate bottom margin based on safe area insets
  // For devices without home button (like iPhone 14), insets.bottom will be around 34
  // For devices with home button, it will be 0
  // We add extra spacing to ensure the tab bar doesn't sit too close to the edge
  const calculatedBottomMargin = bottomMargin !== undefined 
    ? bottomMargin 
    : isTablet 
      ? 24 
      : Math.max(12, insets.bottom > 0 ? 8 : 16);

  // Determine active tab index based on current pathname
  const getActiveIndex = () => {
    console.log('Current pathname:', pathname);
    
    // Check each tab route
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      
      // Home route matching
      if (tab.route === '/(tabs)/(home)') {
        if (pathname.includes('/(home)') || pathname === '/(tabs)' || pathname === '/') {
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

    // Navigate with smooth transition
    try {
      router.push(route as any);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const tabWidth = (containerWidth - (isTablet ? 12 : 16)) / tabs.length;

  // iPad-specific top bar styling
  if (isTablet) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[
          styles.safeAreaTop,
          {
            top: 0,
            backgroundColor: isDark ? darkColors.background : colors.background,
          },
        ]}
        pointerEvents="box-none"
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 85}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.containerTop,
            {
              width: containerWidth,
              borderRadius: 20,
              backgroundColor: isDark 
                ? 'rgba(44, 44, 46, 0.92)' 
                : 'rgba(242, 242, 247, 0.94)',
              borderColor: isDark 
                ? 'rgba(84, 84, 88, 0.28)' 
                : 'rgba(0, 0, 0, 0.06)',
              paddingVertical: 6,
              paddingHorizontal: 6,
            },
          ]}
        >
          {/* Tab buttons */}
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;

            return (
              <TabButtonTop
                key={tab.route}
                tab={tab}
                index={index}
                isActive={isActive}
                tabWidth={tabWidth}
                currentColors={currentColors}
                isDark={isDark}
                onPress={handleTabPress}
                t={t}
              />
            );
          })}
        </BlurView>
      </SafeAreaView>
    );
  }

  // Default bottom bar for phones
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.safeArea,
        {
          bottom: calculatedBottomMargin,
          backgroundColor: isDark ? darkColors.background : colors.background,
        },
      ]}
      pointerEvents="box-none"
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 85}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius: borderRadius,
            backgroundColor: isDark 
              ? 'rgba(44, 44, 46, 0.92)' 
              : 'rgba(242, 242, 247, 0.94)',
            borderColor: isDark 
              ? 'rgba(84, 84, 88, 0.28)' 
              : 'rgba(0, 0, 0, 0.06)',
            paddingVertical: 8,
            paddingHorizontal: 8,
          },
        ]}
      >
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
              t={t}
            />
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

// Separate component for individual tab buttons with optimized animations (bottom bar)
interface TabButtonProps {
  tab: TabBarItem;
  index: number;
  isActive: boolean;
  tabWidth: number;
  currentColors: typeof colors;
  isDark: boolean;
  onPress: (route: string, index: number) => void;
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
  t,
}: TabButtonProps) => {
  const iconScale = useSharedValue(1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      // Subtle bounce animation when tab becomes active
      iconScale.value = withSpring(1.08, {
        damping: 15,
        stiffness: 350,
      }, () => {
        iconScale.value = withSpring(1, {
          damping: 18,
          stiffness: 400,
        });
      });
    } else {
      iconScale.value = withSpring(1, {
        damping: 18,
        stiffness: 400,
      });
    }
  }, [isActive, iconScale]);

  const animatedTabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pressScale.value },
      ],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScale.value },
      ],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0.5, { duration: 200 }),
      transform: [
        {
          scale: withSpring(isActive ? 1 : 0.96, {
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
      ? 'rgba(235, 235, 245, 0.55)' 
      : 'rgba(60, 60, 67, 0.55)';

  const iconSize = 24;
  const fontSize = 10;

  return (
    <Pressable
      style={[styles.tab, { width: tabWidth }]}
      onPress={() => onPress(tab.route, index)}
      onPressIn={() => {
        pressScale.value = withSpring(0.92, {
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
            size={iconSize}
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
              fontSize: fontSize,
            },
          ]}
        >
          {t(tab.labelKey)}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
});

// Separate component for iPad top bar tabs (horizontal layout with text labels)
const TabButtonTop = React.memo(({
  tab,
  index,
  isActive,
  tabWidth,
  currentColors,
  isDark,
  onPress,
  t,
}: TabButtonProps) => {
  const textScale = useSharedValue(1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      // Subtle bounce animation when tab becomes active
      textScale.value = withSpring(1.05, {
        damping: 15,
        stiffness: 350,
      }, () => {
        textScale.value = withSpring(1, {
          damping: 18,
          stiffness: 400,
        });
      });
    } else {
      textScale.value = withSpring(1, {
        damping: 18,
        stiffness: 400,
      });
    }
  }, [isActive, textScale]);

  const animatedTabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pressScale.value },
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0.6, { duration: 200 }),
      transform: [
        { scale: textScale.value },
      ],
    };
  });

  const textColor = isActive 
    ? currentColors.primary 
    : isDark 
      ? 'rgba(235, 235, 245, 0.6)' 
      : 'rgba(60, 60, 67, 0.6)';

  const fontSize = 15;

  return (
    <Pressable
      style={[styles.tabTop, { width: tabWidth }]}
      onPress={() => onPress(tab.route, index)}
      onPressIn={() => {
        pressScale.value = withSpring(0.94, {
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
      <Animated.View style={[styles.tabContentTop, animatedTabStyle]}>
        <Animated.Text
          style={[
            styles.labelTop,
            animatedTextStyle,
            {
              color: textColor,
              fontWeight: isActive ? '600' : '500',
              fontSize: fontSize,
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
  safeAreaTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
    paddingTop: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: Platform.select({
      ios: '0px 8px 24px rgba(0, 0, 0, 0.12)',
      android: '0px 4px 16px rgba(0, 0, 0, 0.15)',
      default: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    }),
    elevation: 10,
    overflow: 'hidden',
  },
  containerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: Platform.select({
      ios: '0px 4px 16px rgba(0, 0, 0, 0.1)',
      android: '0px 2px 12px rgba(0, 0, 0, 0.12)',
      default: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    }),
    elevation: 8,
    overflow: 'hidden',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabTop: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabContentTop: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  label: {
    letterSpacing: -0.08,
    textAlign: 'center',
  },
  labelTop: {
    letterSpacing: -0.2,
    textAlign: 'center',
  },
});
