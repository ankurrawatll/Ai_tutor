export interface LanguageConfig {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  languageCode: string;
  speechRecognitionCode: string;
  speechSynthesisCode: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    languageCode: 'en-US',
    speechRecognitionCode: 'en-US',
    speechSynthesisCode: 'en-US',
    description: 'Practice English conversations'
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    languageCode: 'hi-IN',
    speechRecognitionCode: 'hi-IN',
    speechSynthesisCode: 'hi-IN',
    description: 'हिंदी में बातचीत का अभ्यास करें'
  },
  {
    id: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    languageCode: 'mr-IN',
    speechRecognitionCode: 'mr-IN',
    speechSynthesisCode: 'mr-IN',
    description: 'मराठीत संवाद सराव करा'
  },
  {
    id: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    languageCode: 'gu-IN',
    speechRecognitionCode: 'gu-IN',
    speechSynthesisCode: 'gu-IN',
    description: 'ગુજરાતીમાં વાતચીતનો અભ્યાસ કરો'
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    languageCode: 'ta-IN',
    speechRecognitionCode: 'ta-IN',
    speechSynthesisCode: 'ta-IN',
    description: 'தமிழில் உரையாடல் பயிற்சி செய்யுங்கள்'
  },
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    languageCode: 'te-IN',
    speechRecognitionCode: 'te-IN',
    speechSynthesisCode: 'te-IN',
    description: 'తెలుగులో సంభాషణ అభ్యాసం చేయండి'
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    languageCode: 'kn-IN',
    speechRecognitionCode: 'kn-IN',
    speechSynthesisCode: 'kn-IN',
    description: 'ಕನ್ನಡದಲ್ಲಿ ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ ಮಾಡಿ'
  },
  {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    languageCode: 'ml-IN',
    speechRecognitionCode: 'ml-IN',
    speechSynthesisCode: 'ml-IN',
    description: 'മലയാളത്തിൽ സംവാദം പരിശീലിക്കുക'
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    languageCode: 'bn-IN',
    speechRecognitionCode: 'bn-IN',
    speechSynthesisCode: 'bn-IN',
    description: 'বাংলায় কথোপকথন অনুশীলন করুন'
  },
  {
    id: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    languageCode: 'pa-IN',
    speechRecognitionCode: 'pa-IN',
    speechSynthesisCode: 'pa-IN',
    description: 'ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲਬਾਤ ਦਾ ਅਭਿਆਸ ਕਰੋ'
  }
];

export const getLanguageById = (id: string): LanguageConfig | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.id === id);
};

export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.languageCode === code);
};

export const getDefaultLanguage = (): LanguageConfig => {
  return SUPPORTED_LANGUAGES[0]; // English
}; 