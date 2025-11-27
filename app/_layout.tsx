
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert, View } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/button";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { ThemeProvider as CustomThemeProvider, useThemeMode } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { colors, darkColors } from "@/styles/commonStyles";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Define themes at the top level before they are used
const CustomDefaultTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.error,
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.card,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.error,
  },
};

function RootLayoutContent() {
  const systemColorScheme = useColorScheme();
  const { isDark } = useThemeMode();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const networkState = useNetworkState();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authLoading]);

  // Handle authentication-based navigation
  useEffect(() => {
    if (!loaded || authLoading || !navigationState?.key) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation check:', {
      isAuthenticated,
      segments,
      inAuthGroup,
      inTabsGroup,
    });

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth screens, redirect to welcome
      console.log('Redirecting to welcome screen');
      router.replace('/auth/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth screens, redirect to home
      console.log('Redirecting to home screen');
      router.replace('/(tabs)/(home)');
    }
  }, [isAuthenticated, segments, loaded, authLoading, navigationState?.key]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!loaded || authLoading) {
    return null;
  }

  return (
    <>
      {/* Background view that extends to all edges including status bar and bottom areas */}
      <View 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? darkColors.background : colors.background,
          zIndex: -1,
        }} 
      />
      <StatusBar 
        style={isDark ? "light" : "dark"} 
        animated 
        backgroundColor={isDark ? darkColors.background : colors.background}
        translucent={false}
      />
      <ThemeProvider value={isDark ? CustomDarkTheme : CustomDefaultTheme}>
        <WidgetProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: isDark ? darkColors.background : colors.background }}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: isDark ? darkColors.background : colors.background,
                },
              }}
            >
              {/* Auth screens */}
              <Stack.Screen name="auth" options={{ headerShown: false }} />

              {/* Main app with tabs */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Modal Demo Screens */}
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  title: "Standard Modal",
                }}
              />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: "formSheet",
                  title: "Form Sheet Modal",
                  sheetGrabberVisible: true,
                  sheetAllowedDetents: [0.5, 0.8, 1.0],
                  sheetCornerRadius: 20,
                }}
              />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />
            </Stack>
            <SystemBars style={isDark ? "light" : "dark"} />
          </GestureHandlerRootView>
        </WidgetProvider>
      </ThemeProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </LanguageProvider>
    </CustomThemeProvider>
  );
}
