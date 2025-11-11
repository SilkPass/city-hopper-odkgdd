
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

  const activeIndex = tabs.findIndex((tab) => {
    if (tab.route === '/(home)') {
      return pathname === '/(tabs)/(home)' || pathname === '/(tabs)/(home)/';
    }
    return pathname.includes(tab.route);
  });

  const indicatorPosition = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  React.useEffect(() => {
    if (activeIndex >= 0) {
      indicatorPosition.value = withSpring(activeIndex, {
        damping: 20,
        stiffness: 200,
      });
    }
  }, [activeIndex]);

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

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

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
              ? 'rgba(28, 28, 30, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
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
                  {t(tab.label)}
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
