
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

export type SupportedLanguage = 'en' | 'ru' | 'mn' | 'kk' | 'uz';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  i18n: I18n;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Translation strings
const translations = {
  en: {
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
    selectLanguage: 'Select Language',
    english: 'English',
    russian: 'Русский',
    mongolian: 'Монгол',
    kazakh: 'Қазақша',
    uzbek: 'Oʻzbekcha',
  },
  ru: {
    welcome: 'Добро пожаловать в',
    searchDestinations: 'Поиск направлений...',
    searchSelectCity: 'Найти и выбрать город',
    selectCity: 'Выбрать город',
    closestToYou: 'Ближайший к вам',
    noCitiesFound: 'Города не найдены',
    selectCityToContinue: 'Выберите город для продолжения',
    exploreServices: 'Изучить услуги',
    myGuide: 'Мой гид',
    exploreLocalRecommendations: 'Изучите местные рекомендации',
    esim: 'eSIM',
    stayConnected: 'Оставайтесь на связи',
    payment: 'Оплата',
    easyTransactions: 'Легкие транзакции',
    enableLocation: 'Включить геолокацию',
    allowLocationAccess: 'Разрешите доступ к местоположению для автоматического поиска ближайшего города',
    gettingYourLocation: 'Получение вашего местоположения...',
    accountSettings: 'Настройки аккаунта',
    editProfile: 'Редактировать профиль',
    notifications: 'Уведомления',
    privacySecurity: 'Конфиденциальность и безопасность',
    preferences: 'Предпочтения',
    language: 'Язык',
    darkMode: 'Темный режим',
    signOut: 'Выйти',
    cities: 'Города',
    home: 'Главная',
    profile: 'Профиль',
    selectLanguage: 'Выбрать язык',
    english: 'English',
    russian: 'Русский',
    mongolian: 'Монгол',
    kazakh: 'Қазақша',
    uzbek: 'Oʻzbekcha',
  },
  mn: {
    welcome: 'Тавтай морил',
    searchDestinations: 'Газар хайх...',
    searchSelectCity: 'Хот хайж сонгох',
    selectCity: 'Хот сонгох',
    closestToYou: 'Танд хамгийн ойр',
    noCitiesFound: 'Хот олдсонгүй',
    selectCityToContinue: 'Үргэлжлүүлэхийн тулд хот сонгоно уу',
    exploreServices: 'Үйлчилгээ судлах',
    myGuide: 'Миний хөтөч',
    exploreLocalRecommendations: 'Орон нутгийн зөвлөмжийг судлах',
    esim: 'eSIM',
    stayConnected: 'Холбоотой байх',
    payment: 'Төлбөр',
    easyTransactions: 'Хялбар гүйлгээ',
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
    selectLanguage: 'Хэл сонгох',
    english: 'English',
    russian: 'Русский',
    mongolian: 'Монгол',
    kazakh: 'Қазақша',
    uzbek: 'Oʻzbekcha',
  },
  kk: {
    welcome: 'Қош келдіңіз',
    searchDestinations: 'Бағыттарды іздеу...',
    searchSelectCity: 'Қаланы іздеу және таңдау',
    selectCity: 'Қаланы таңдау',
    closestToYou: 'Сізге ең жақын',
    noCitiesFound: 'Қалалар табылмады',
    selectCityToContinue: 'Жалғастыру үшін қаланы таңдаңыз',
    exploreServices: 'Қызметтерді зерттеу',
    myGuide: 'Менің гидім',
    exploreLocalRecommendations: 'Жергілікті ұсыныстарды зерттеу',
    esim: 'eSIM',
    stayConnected: 'Байланыста болыңыз',
    payment: 'Төлем',
    easyTransactions: 'Оңай транзакциялар',
    enableLocation: 'Орынды қосу',
    allowLocationAccess: 'Ең жақын қаланы автоматты түрде табу үшін орынға қол жеткізуге рұқсат беріңіз',
    gettingYourLocation: 'Сіздің орныңызды алу...',
    accountSettings: 'Тіркелгі параметрлері',
    editProfile: 'Профильді өңдеу',
    notifications: 'Хабарландырулар',
    privacySecurity: 'Құпиялылық және қауіпсіздік',
    preferences: 'Параметрлер',
    language: 'Тіл',
    darkMode: 'Қараңғы режим',
    signOut: 'Шығу',
    cities: 'Қалалар',
    home: 'Басты бет',
    profile: 'Профиль',
    selectLanguage: 'Тілді таңдау',
    english: 'English',
    russian: 'Русский',
    mongolian: 'Монгол',
    kazakh: 'Қазақша',
    uzbek: 'Oʻzbekcha',
  },
  uz: {
    welcome: 'Xush kelibsiz',
    searchDestinations: 'Yo'nalishlarni qidirish...',
    searchSelectCity: 'Shaharni qidirish va tanlash',
    selectCity: 'Shaharni tanlash',
    closestToYou: 'Sizga eng yaqin',
    noCitiesFound: 'Shaharlar topilmadi',
    selectCityToContinue: 'Davom etish uchun shaharni tanlang',
    exploreServices: 'Xizmatlarni o'rganish',
    myGuide: 'Mening yo'lboshchim',
    exploreLocalRecommendations: 'Mahalliy tavsiyalarni o'rganing',
    esim: 'eSIM',
    stayConnected: 'Aloqada bo'ling',
    payment: 'To'lov',
    easyTransactions: 'Oson tranzaksiyalar',
    enableLocation: 'Joylashuvni yoqish',
    allowLocationAccess: 'Eng yaqin shaharni avtomatik topish uchun joylashuvga kirishga ruxsat bering',
    gettingYourLocation: 'Sizning joylashuvingizni olish...',
    accountSettings: 'Hisob sozlamalari',
    editProfile: 'Profilni tahrirlash',
    notifications: 'Bildirishnomalar',
    privacySecurity: 'Maxfiylik va xavfsizlik',
    preferences: 'Sozlamalar',
    language: 'Til',
    darkMode: 'Qorong'i rejim',
    signOut: 'Chiqish',
    cities: 'Shaharlar',
    home: 'Bosh sahifa',
    profile: 'Profil',
    selectLanguage: 'Tilni tanlash',
    english: 'English',
    russian: 'Русский',
    mongolian: 'Монгол',
    kazakh: 'Қазақша',
    uzbek: 'Oʻzbekcha',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [i18n] = useState(() => {
    const i18nInstance = new I18n(translations);
    i18nInstance.enableFallback = true;
    i18nInstance.defaultLocale = 'en';
    return i18nInstance;
  });

  useEffect(() => {
    // Try to detect user's language from device settings
    const deviceLocale = Localization.getLocales()[0]?.languageCode;
    console.log('Device locale:', deviceLocale);
    
    if (deviceLocale) {
      const supportedLanguages: SupportedLanguage[] = ['en', 'ru', 'mn', 'kk', 'uz'];
      const matchedLanguage = supportedLanguages.find(lang => deviceLocale.startsWith(lang));
      if (matchedLanguage) {
        setLanguageState(matchedLanguage);
        i18n.locale = matchedLanguage;
        console.log('Auto-detected language:', matchedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    i18n.locale = lang;
    console.log('Language changed to:', lang);
  };

  const t = (key: string): string => {
    return i18n.t(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};
