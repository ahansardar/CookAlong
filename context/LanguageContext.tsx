'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'gu' | 'mr' | 'bn' | 'pa' | 'ur' | 'or' | 'as' | 'sa' | 'ko' | 'mn' | 'ne' | 'si' | 'dg' | 'ks' | 'br' | 'mt' | 'st'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguage') as Language | null
    if (saved) {
      setLanguage(saved)
    }
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('preferredLanguage', language)
    }
  }, [language, isMounted])

  const t = (key: string): string => {
    const translations: Record<Language, Record<string, string>> = {
      en: {
        'home.title': 'Step-by-step cooking made easy',
        'home.description': 'Follow along with timed instructions that guide you through each recipe. Perfect for cooking in the kitchen with your phone or tablet.',
        'home.viewRecipe': 'View Recipe',
        'recipe.ingredients': 'Ingredients',
        'recipe.steps': 'Steps',
        'recipe.cookAlong': 'Cook Along',
        'recipe.time': 'Time',
        'recipe.servings': 'Servings',
        'cookAlong.currentStep': 'Current Step',
        'cookAlong.next': 'Next Step',
        'cookAlong.previous': 'Previous Step',
        'cookAlong.complete': 'Cooking Complete',
        'common.language': 'Language',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'বাংলা',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      hi: {
        'home.title': 'चरण-दर-चरण खाना बनाना आसान बनाया',
        'home.description': 'समयबद्ध निर्देशों के साथ चलें जो आपको प्रत्येक रेसिपी के माध्यम से गाइड करते हैं। अपने फोन या टैबलेट के साथ रसोई में खाना बनाने के लिए बिल्कुल सही।',
        'home.viewRecipe': 'रेसिपी देखें',
        'recipe.ingredients': 'सामग्री',
        'recipe.steps': 'कदम',
        'recipe.cookAlong': 'साथ में पकाएं',
        'recipe.time': 'समय',
        'recipe.servings': 'सेवन',
        'cookAlong.currentStep': 'वर्तमान कदम',
        'cookAlong.next': 'अगला कदम',
        'cookAlong.previous': 'पिछला कदम',
        'cookAlong.complete': 'खाना बनाना पूर्ण',
        'common.language': 'भाषा',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'बांला',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      ta: {
        'home.title': 'படிப்படியான சமையல் எளிதாக்கப்பட்டது',
        'home.description': 'நேரமிடப்பட்ட வழிமுறைகளைப் பின்தொடர்ந்து ஒவ்வொரு சமையல் வழிக்காட்டிக்கும் வழிகாட்டி. உங்கள் ஸ்மார்ட்ஃபோன் அல்லது டேப்லெட்டுடன் சமையலறையில் சமைப்பதற்கு சிறந்தது.',
        'home.viewRecipe': 'சமையல் வழிக்காட்டி பார்க்க',
        'recipe.ingredients': 'பொருட்கள்',
        'recipe.steps': 'படிகள்',
        'recipe.cookAlong': 'சேர்ந்து சமைக்க',
        'recipe.time': 'நேரம்',
        'recipe.servings': 'பரிமாணம்',
        'cookAlong.currentStep': 'தற்போதைய படி',
        'cookAlong.next': 'அடுத்த படி',
        'cookAlong.previous': 'முந்தைய படி',
        'cookAlong.complete': 'சமையல் முடிந்தது',
        'common.language': 'மொழி',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'বাংলা',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      te: {
        'home.title': 'దశ-దశ వంటకూ సులభం చేయబడింది',
        'home.description': 'సమయం ఆధారిత సూచనలను అనుసరించండి, ఇవి మీకు ప్రతిి రెసిపీ ద్వారా గైడ్ చేస్తాయి. మీ ఫోన్ లేదా టాబ్లెట్‌తో క్రిందడిలో వంట చేయడానికి ఖచ్చితంగా ఉత్తమం.',
        'home.viewRecipe': 'రెసిపీ చూడండి',
        'recipe.ingredients': 'పదార్థాలు',
        'recipe.steps': 'దశలు',
        'recipe.cookAlong': 'కలిసి వండండి',
        'recipe.time': 'సమయం',
        'recipe.servings': 'సేవలు',
        'cookAlong.currentStep': 'ప్రస్తుత దశ',
        'cookAlong.next': 'తదుపరి దశ',
        'cookAlong.previous': 'మునుపటి దశ',
        'cookAlong.complete': 'వంట పూర్తయింది',
        'common.language': 'భాష',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'বাংলা',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      kn: {
        'home.title': 'ಹಂತ-ಹಂತದ ಹಾಗೂ ಪಾಕವಿದ್ಯೆ ಸುಲಭವಾಗಿದೆ',
        'home.description': 'ಸಮಯ-ಬದ್ಧ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ ಪ್ರತಿಯೊಂದು ಪಾಕವಿಧಾನದ ಮೂಲಕ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ. ನಿಮ್ಮ ಫೋನ್ ಅಥವಾ ಟ್ಯಾಬ್ಲೆಟ್‌ನೊಂದಿಗೆ ಅಡುಗೆಯಲ್ಲಿ ಪಾಕವಿದ್ಯೆಗೆ ಪರಿೂರ್ಣ.',
        'home.viewRecipe': 'ಪಾಕವಿಧಾನ ನೋಡಿ',
        'recipe.ingredients': 'ಪದಾರ್ಥಗಳು',
        'recipe.steps': 'ಹಂತಗಳು',
        'recipe.cookAlong': 'ಜೊತೆಗೆ ಪಾಕವಿದ್ಯೆ ಮಾಡಿ',
        'recipe.time': 'ಸಮಯ',
        'recipe.servings': 'ಸೇವನೆ',
        'cookAlong.currentStep': 'ಪ್ರಸ್ತುತ ಹಂತ',
        'cookAlong.next': 'ಮುಂದಿನ ಹಂತ',
        'cookAlong.previous': 'ಹಿಂದಿನ ಹಂತ',
        'cookAlong.complete': 'ಪಾಕವಿದ್ಯೆ ಪೂರ್ಣ',
        'common.language': 'ಭಾಷೆ',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'বাংলা',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      ml: {
        'home.title': 'ഘട്ടം-ഘട്ടമായ പാചകം എളുപ്പമാക്കി',
        'home.description': 'സമയ-ബന്ധിത നിർദ്ദേശങ്ങൾ പിന്തുടരുക, അത് ഓരോ പാചക വിഭവങ്ങളിലൂടെയും നിങ്ങളെ ഗൈഡ് ചെയ്യുന്നു. നിങ്ങളുടെ ഫോണ് അല്ലെങ്കിൽ ടാബ്‌ലെറ്റ് ഉപയോഗിച്ച് അടുക്കളയിൽ പാചകം ചെയ്യാൻ തികച്ചും അനുയോജ്യം.',
        'home.viewRecipe': 'പാചക വിഭവം കാണുക',
        'recipe.ingredients': 'ചേരുവകൾ',
        'recipe.steps': 'ഘട്ടങ്ങൾ',
        'recipe.cookAlong': 'ഒരുമിച്ച് പാചകം ചെയ്യുക',
        'recipe.time': 'സമയം',
        'recipe.servings': 'സേവനം',
        'cookAlong.currentStep': 'നിലവിലെ ഘട്ടം',
        'cookAlong.next': 'അടുത്ത ഘട്ടം',
        'cookAlong.previous': 'മുൻപിലെ ഘട്ടം',
        'cookAlong.complete': 'പാചകം പൂർത്തിയായി',
        'common.language': 'ഭാഷ',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'বাংലা',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      gu: {
        'home.title': 'પગલું-દર-પગલું રસોઇ સહેલી બનાઇ',
        'home.description': 'સમય-સંબંધિત સૂચનાઓને અનુસરો કે જે તમને દરેક રેસિપી દ્વારા માર્ગદર્શન આપે છે. તમારા ફોન અથવા ટેબલેટ સાથે રસોઇમાં પકાવવા માટે બિલકુલ યોગ્ય.',
        'home.viewRecipe': 'રેસિપી જુઓ',
        'recipe.ingredients': 'સામગ્રી',
        'recipe.steps': 'પગલાં',
        'recipe.cookAlong': 'સાથે રસોઇ કરો',
        'recipe.time': 'સમય',
        'recipe.servings': 'સેવન',
        'cookAlong.currentStep': 'વર્તમાન પગલું',
        'cookAlong.next': 'આગામી પગલું',
        'cookAlong.previous': 'પૂર્વ પગલું',
        'cookAlong.complete': 'રસોઇ પૂર્ણ',
        'common.language': 'ભાષા',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'મરાઠી',
        'common.bengali': 'बांલा',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      mr: {
        'home.title': 'चरण-दर-चरण स्वयंपाक सहज केली',
        'home.description': 'वेळेची बंधने असलेल्या निर्देशांचे पालन करा जे तुम्हाला प्रत्येक रेसिपीद्वारे मार्गदर्शन करतात. तुमच्या फोन किंवा टॅबलेटसह स्वयंपाकघरात स्वयंपाक करण्यासाठी बिल्कुल योग्य.',
        'home.viewRecipe': 'रेसिपी पहा',
        'recipe.ingredients': 'घटक',
        'recipe.steps': 'पायऱ्या',
        'recipe.cookAlong': 'एकत्र स्वयंपाक करा',
        'recipe.time': 'वेळ',
        'recipe.servings': 'सेवन',
        'cookAlong.currentStep': 'वर्तमान पायरी',
        'cookAlong.next': 'पुढील पायरी',
        'cookAlong.previous': 'मागील पायरी',
        'cookAlong.complete': 'स्वयंपाक पूर्ण',
        'common.language': 'भाषा',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'बांলा',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      bn: {
        'home.title': 'ধাপে ধাপে রান্না সহজ করা হয়েছে',
        'home.description': 'সময়বদ্ধ নির্দেশাবলী অনুসরণ করুন যা প্রতিটি রেসিপির মাধ্যমে আপনাকে গাইড করে। আপনার ফোন বা ট্যাবলেট দিয়ে রান্নাঘরে রান্নার জন্য একেবারে নিখুঁত।',
        'home.viewRecipe': 'রেসিপি দেখুন',
        'recipe.ingredients': 'উপাদান',
        'recipe.steps': 'পদক্ষেপ',
        'recipe.cookAlong': 'সাথে রান্না করুন',
        'recipe.time': 'সময়',
        'recipe.servings': 'পরিবেশন',
        'cookAlong.currentStep': 'বর্তমান পদক্ষেপ',
        'cookAlong.next': 'পরবর্তী পদক্ষেপ',
        'cookAlong.previous': 'আগের পদক্ষেপ',
        'cookAlong.complete': 'রান্না সম্পন্ন',
        'common.language': 'ভাষা',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मરाठी',
        'common.bengali': 'বাংলা',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
      pa: {
        'home.title': 'ਕਦਮ-ਦਰ-ਕਦਮ ਖਾਣਾ ਪਕਾਉਣਾ ਆਸਾਨ ਬਣਾਇਆ ਗਿਆ',
        'home.description': 'ਸਮੇਂ-ਬੱਧ ਹਦਾਇਤਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ ਜੋ ਤੁਹਾਨੂੰ ਹਰੇਕ ਖਾਣੇ ਦੀ ਰਸੀਪੀ ਦੇ ਜ਼ਰੀਏ ਗਾਈਡ ਕਰਦੇ ਹਨ। ਆਪਣੇ ਫੋਨ ਜਾਂ ਟੈਬਲੇਟ ਦੇ ਨਾਲ ਰਸੋਈ ਵਿੱਚ ਖਾਣਾ ਪਕਾਉਣ ਲਈ ਬਿਲਕੁਲ ਬਿਰਤਾ।',
        'home.viewRecipe': 'ਖਾਣੇ ਦੀ ਰਸੀਪੀ ਦੇਖੋ',
        'recipe.ingredients': 'ਪ੍ਰਾਸ਼ੀਂ',
        'recipe.steps': 'ਪੜਾਅ',
        'recipe.cookAlong': 'ਨਾਲ ਖਾਣਾ ਪਕਾਉ',
        'recipe.time': 'ਸਮਾ',
        'recipe.servings': 'ਸੇਵਾ',
        'cookAlong.currentStep': 'ਮੌਜੂਦਾ ਪੜਾਅ',
        'cookAlong.next': 'ਅਗਲਾ ਪੜਾਅ',
        'cookAlong.previous': 'ਪਿਛਲਾ ਪੜਾਅ',
        'cookAlong.complete': 'ਖਾਣਾ ਤਿਆਰ ਕਰ ਲਿਆ ਗਿਆ',
        'common.language': 'ਭਾਸ਼ਾ',
        'common.english': 'English',
        'common.hindi': 'हिंदी',
        'common.tamil': 'தமிழ்',
        'common.telugu': 'తెలుగు',
        'common.kannada': 'ಕನ್ನಡ',
        'common.malayalam': 'മലയാളം',
        'common.gujarati': 'ગુજરાતી',
        'common.marathi': 'मराठी',
        'common.bengali': 'ਬांਲਾ',
        'common.punjabi': 'ਪੰਜਾਬੀ',
      },
    }

    // All new Indian languages fall back to English until translations are added
    const enFallback = translations.en
    const newLangs: Language[] = ['ur', 'or', 'as', 'sa', 'ko', 'mn', 'ne', 'si', 'dg', 'ks', 'br', 'mt', 'st']
    for (const lang of newLangs) {
      translations[lang] = enFallback
    }

    return translations[language]?.[key] || translations.en?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
