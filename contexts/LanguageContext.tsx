
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
  searchAttractions: 'Search attractions...',
  selectCity: 'Select City',
  closestToYou: 'Closest to you',
  noCitiesFound: 'No cities found',
  selectCityFirst: 'Select a city first',
  exploreAttractions: 'Explore Attractions',
  popularAttractions: 'Popular Attractions',
  forbiddenCity: 'Forbidden City',
  summerPalace: 'Summer Palace',
  greatWall: 'Great Wall',
  templeOfHeaven: 'Temple of Heaven',
  theBund: 'The Bund',
  yuGarden: 'Yu Garden',
  orientalPearlTower: 'Oriental Pearl Tower',
  victoriaHarbour: 'Victoria Harbour',
  victoriasPeak: 'Victoria\'s Peak',
  templeSt: 'Temple Street',
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
  noAttractionsFound: 'No attractions found',
  historicalSite: 'Historical Site',
  culturalLandmark: 'Cultural Landmark',
  scenicSpot: 'Scenic Spot',
  modernAttraction: 'Modern Attraction',
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
