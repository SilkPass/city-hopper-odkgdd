
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations = {
  welcome: 'Welcome to',
  searchDestinations: 'Search destinations...',
  searchSelectCity: 'Search and select city',
  selectCity: 'Select City',
  closestToYou: 'Closest to you',
  noCitiesFound: 'No cities found',
  selectCityToContinue: 'Select a city to continue',
  exploreServices: 'Explore Services',
  myGuide: 'My Guide',
  exploreLocalRecommendations: 'Explore local recommendations',
  esim: 'eSIM',
  stayConnected: 'Stay connected',
  payment: 'Payment',
  easyTransactions: 'Easy transactions',
  enableLocation: 'Enable Location',
  allowLocationAccess: 'Allow location access to automatically find the nearest city',
  gettingYourLocation: 'Getting your location...',
  accountSettings: 'Account Settings',
  editProfile: 'Edit Profile',
  notifications: 'Notifications',
  privacySecurity: 'Privacy & Security',
  preferences: 'Preferences',
  language: 'Language',
  darkMode: 'Dark Mode',
  signOut: 'Sign Out',
  cities: 'Cities',
  home: 'Home',
  profile: 'Profile',
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};
