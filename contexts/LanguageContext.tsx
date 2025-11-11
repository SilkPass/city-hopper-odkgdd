
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
  language: 'en' | 'mn';
  setLanguage: (lang: 'en' | 'mn') => void;
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
  en: {
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
    services: 'Services',
    noAttractionsFound: 'No attractions found',
    historicalSite: 'Historical Site',
    culturalLandmark: 'Cultural Landmark',
    scenicSpot: 'Scenic Spot',
    modernAttraction: 'Modern Attraction',
    attractions: 'attractions',
    quickActions: 'Quick Actions',
    weatherForecast: 'Weather Forecast',
    checkLocalWeather: 'Check local weather conditions',
    transportation: 'Transportation',
    findNearbyTransit: 'Find nearby transit options',
    languageAssistant: 'Language Assistant',
    translateEasily: 'Translate and communicate easily',
    eSIM: 'eSIM',
    stayConnected: 'Stay connected locally',
    payment: 'Payment',
    securePayment: 'Secure payment options',
    guide: 'Guide',
    exploreLocal: 'Explore local attractions',
    emergency: 'Emergency',
    quickEmergency: 'Quick emergency access',
    mapsNotSupported: 'Maps are not supported in Natively web preview',
    noAttractionsAvailable: 'No attractions available',
    beijing: 'Beijing',
    shanghai: 'Shanghai',
    hongKong: 'Hong Kong',
    hohhot: 'Hohhot',
    ordos: 'Ordos',
    macau: 'Macau',
    servicesDescription: 'Access essential services for your journey',
    essentialServices: 'Essential Services',
    convenienceServices: 'Convenience Services',
    supportServices: 'Support Services',
    currencyExchange: 'Currency Exchange',
    convertCurrency: 'Convert currency easily',
    healthServices: 'Health Services',
    findMedicalHelp: 'Find medical help nearby',
    accommodation: 'Accommodation',
    findPlaceToStay: 'Find a place to stay',
    dining: 'Dining',
    discoverRestaurants: 'Discover local restaurants',
    visaInfo: 'Visa Information',
    visaRequirements: 'Check visa requirements',
  },
  mn: {
    welcome: 'Тавтай морилно уу',
    searchAttractions: 'Үзвэрийн газар хайх...',
    selectCity: 'Хот сонгох',
    closestToYou: 'Танд хамгийн ойр',
    noCitiesFound: 'Хот олдсонгүй',
    selectCityFirst: 'Эхлээд хот сонгоно уу',
    exploreAttractions: 'Үзвэрийн газруудыг судлах',
    popularAttractions: 'Алдартай үзвэрийн газрууд',
    forbiddenCity: 'Хориотой хот',
    summerPalace: 'Зуны ордон',
    greatWall: 'Их хана',
    templeOfHeaven: 'Тэнгэрийн сүм',
    theBund: 'Бунд',
    yuGarden: 'Юй цэцэрлэг',
    orientalPearlTower: 'Дорнын сувдан цамхаг',
    victoriaHarbour: 'Викториягийн боомт',
    victoriasPeak: 'Викториягийн оргил',
    templeSt: 'Сүмийн гудамж',
    enableLocation: 'Байршил идэвхжүүлэх',
    allowLocationAccess: 'Хамгийн ойрын хотыг автоматаар олохын тулд байршлын хандалтыг зөвшөөрнө үү',
    gettingYourLocation: 'Таны байршлыг авч байна...',
    accountSettings: 'Дансны тохиргоо',
    editProfile: 'Профайл засах',
    notifications: 'Мэдэгдэл',
    privacySecurity: 'Нууцлал ба аюулгүй байдал',
    preferences: 'Тохиргоо',
    language: 'Хэл',
    darkMode: 'Харанхуй горим',
    signOut: 'Гарах',
    cities: 'Хотууд',
    home: 'Нүүр',
    profile: 'Профайл',
    services: 'Үйлчилгээ',
    noAttractionsFound: 'Үзвэрийн газар олдсонгүй',
    historicalSite: 'Түүхийн дурсгалт газар',
    culturalLandmark: 'Соёлын дурсгалт газар',
    scenicSpot: 'Үзэсгэлэнт газар',
    modernAttraction: 'Орчин үеийн үзвэрийн газар',
    attractions: 'үзвэрийн газар',
    quickActions: 'Шуурхай үйлдэл',
    weatherForecast: 'Цаг агаарын урьдчилсан мэдээ',
    checkLocalWeather: 'Орон нутгийн цаг агаарын нөхцлийг шалгах',
    transportation: 'Тээвэр',
    findNearbyTransit: 'Ойролцоох тээврийн хэрэгслийг олох',
    languageAssistant: 'Хэлний туслах',
    translateEasily: 'Орчуулах ба амархан харилцах',
    eSIM: 'eSIM',
    stayConnected: 'Орон нутагт холбогдсон байх',
    payment: 'Төлбөр',
    securePayment: 'Аюулгүй төлбөрийн сонголт',
    guide: 'Хөтөч',
    exploreLocal: 'Орон нутгийн үзвэрийн газруудыг судлах',
    emergency: 'Яаралтай',
    quickEmergency: 'Яаралтай тусламжийн шуурхай хандалт',
    mapsNotSupported: 'Газрын зураг Natively вэб урьдчилан үзэхэд дэмжигдэхгүй байна',
    noAttractionsAvailable: 'Үзвэрийн газар байхгүй байна',
    beijing: 'Бээжин',
    shanghai: 'Шанхай',
    hongKong: 'Хонг Конг',
    hohhot: 'Хөх хот',
    ordos: 'Ордос',
    macau: 'Макао',
    servicesDescription: 'Таны аялалд зайлшгүй шаардлагатай үйлчилгээнд хандах',
    essentialServices: 'Зайлшгүй үйлчилгээ',
    convenienceServices: 'Тав тухтай үйлчилгээ',
    supportServices: 'Дэмжлэгийн үйлчилгээ',
    currencyExchange: 'Валют солилцоо',
    convertCurrency: 'Валют амархан солих',
    healthServices: 'Эрүүл мэндийн үйлчилгээ',
    findMedicalHelp: 'Ойролцоох эмнэлгийн тусламж олох',
    accommodation: 'Байр',
    findPlaceToStay: 'Байрлах газар олох',
    dining: 'Хоол',
    discoverRestaurants: 'Орон нутгийн ресторан олох',
    visaInfo: 'Визний мэдээлэл',
    visaRequirements: 'Визний шаардлагыг шалгах',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'mn'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
