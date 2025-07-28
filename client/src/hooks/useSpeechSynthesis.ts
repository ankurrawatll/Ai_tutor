import { useState, useCallback } from 'react';

interface UseSpeechSynthesisOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  availableVoices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRateState] = useState(options.rate || 1.0);
  const [pitch, setPitchState] = useState(options.pitch || 1.1);
  const [volume, setVolumeState] = useState(options.volume || 1.0);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const loadVoices = useCallback(() => {
    if (isSupported) {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice based on language
      if (!selectedVoice && availableVoices.length > 0) {
        // Try to find a voice for the specific language
        let defaultVoice = availableVoices.find(
          voice => voice.lang === (options.language || 'en-US')
        );
        
        // If no exact match, try to find a voice with similar language code
        if (!defaultVoice && options.language) {
          const langPrefix = options.language.split('-')[0];
          defaultVoice = availableVoices.find(
            voice => voice.lang.startsWith(langPrefix)
          );
        }
        
        // For Indian languages, try to find any Indian language voice
        if (!defaultVoice) {
          const indianLanguages = ['hi', 'mr', 'gu', 'ta', 'te', 'kn', 'ml', 'bn', 'pa'];
          defaultVoice = availableVoices.find(
            voice => indianLanguages.some(lang => voice.lang.startsWith(lang))
          );
        }
        
        // Special handling for Marathi and Gujarati - try Hindi voice as fallback
        if (!defaultVoice && (options.language === 'mr-IN' || options.language === 'gu-IN')) {
          defaultVoice = availableVoices.find(voice => voice.lang.startsWith('hi'));
        }
        
        // Fallback to any available voice
        if (!defaultVoice) {
          defaultVoice = availableVoices[0];
        }
        
        setSelectedVoice(defaultVoice || null);
      }
    }
  }, [isSupported, options.language, selectedVoice]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find the best available voice for the language
    let bestVoice = selectedVoice;
    
    if (!bestVoice || bestVoice.lang !== (options.language || 'en-US')) {
      const availableVoices = speechSynthesis.getVoices();
      
      // Try exact language match
      bestVoice = availableVoices.find(
        voice => voice.lang === (options.language || 'en-US')
      ) || null;
      
      // Try language prefix match (e.g., 'hi' for 'hi-IN')
      if (!bestVoice && options.language) {
        const langPrefix = options.language.split('-')[0];
        bestVoice = availableVoices.find(
          voice => voice.lang.startsWith(langPrefix)
        ) || null;
      }
      
      // For Indian languages, try to find any Indian language voice
      if (!bestVoice && options.language && options.language.includes('-IN')) {
        const indianLanguages = ['hi', 'mr', 'gu', 'ta', 'te', 'kn', 'ml', 'bn', 'pa'];
        bestVoice = availableVoices.find(
          voice => indianLanguages.some(lang => voice.lang.startsWith(lang))
        ) || null;
      }
      
      // Special handling for Marathi and Gujarati - try Hindi voice as fallback
      if (!bestVoice && (options.language === 'mr-IN' || options.language === 'gu-IN')) {
        bestVoice = availableVoices.find(voice => voice.lang.startsWith('hi')) || null;
        console.log('Using Hindi voice for Marathi/Gujarati TTS');
      }
      
      // Fallback to English voice for Indian languages if no native voice available
      if (!bestVoice && options.language && options.language.includes('-IN')) {
        bestVoice = availableVoices.find(voice => voice.lang.startsWith('en')) || null;
      }
      
      // Final fallback to any available voice
      if (!bestVoice) {
        bestVoice = availableVoices[0] || null;
      }
    }
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    utterance.lang = options.language || 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      console.log('Speech synthesis started:', {
        text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        language: options.language,
        voice: bestVoice?.name,
        voiceLang: bestVoice?.lang,
        targetLang: options.language
      });
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      console.log('Speech synthesis ended');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setIsPaused(false);
      
      // For Indian languages, try fallback with Hindi voice first, then English
      if (options.language && options.language.includes('-IN')) {
        console.log('Trying fallback for Indian language TTS');
        const availableVoices = speechSynthesis.getVoices();
        
        // Try Hindi voice for Marathi/Gujarati
        if (options.language === 'mr-IN' || options.language === 'gu-IN') {
          const hindiVoice = availableVoices.find(voice => voice.lang.startsWith('hi'));
          if (hindiVoice) {
            console.log('Trying Hindi voice fallback for Marathi/Gujarati');
            const fallbackUtterance = new SpeechSynthesisUtterance(text);
            fallbackUtterance.voice = hindiVoice;
            fallbackUtterance.lang = 'hi-IN';
            fallbackUtterance.rate = rate;
            fallbackUtterance.pitch = pitch;
            fallbackUtterance.volume = volume;
            
            fallbackUtterance.onstart = () => {
              setIsSpeaking(true);
              setIsPaused(false);
              console.log('Hindi fallback speech synthesis started');
            };
            
            fallbackUtterance.onend = () => {
              setIsSpeaking(false);
              setIsPaused(false);
              console.log('Hindi fallback speech synthesis ended');
            };
            
            fallbackUtterance.onerror = (fallbackEvent) => {
              console.error('Hindi fallback also failed, trying English');
              // Final fallback to English
              const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
              if (englishVoice) {
                const englishUtterance = new SpeechSynthesisUtterance(text);
                englishUtterance.voice = englishVoice;
                englishUtterance.lang = 'en-US';
                englishUtterance.rate = rate;
                englishUtterance.pitch = pitch;
                englishUtterance.volume = volume;
                
                englishUtterance.onstart = () => {
                  setIsSpeaking(true);
                  setIsPaused(false);
                  console.log('English fallback speech synthesis started');
                };
                
                englishUtterance.onend = () => {
                  setIsSpeaking(false);
                  setIsPaused(false);
                  console.log('English fallback speech synthesis ended');
                };
                
                speechSynthesis.speak(englishUtterance);
              }
            };
            
            speechSynthesis.speak(fallbackUtterance);
            return;
          }
        }
        
        // For other Indian languages, try English voice
        const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
        if (englishVoice) {
          const fallbackUtterance = new SpeechSynthesisUtterance(text);
          fallbackUtterance.voice = englishVoice;
          fallbackUtterance.lang = 'en-US';
          fallbackUtterance.rate = rate;
          fallbackUtterance.pitch = pitch;
          fallbackUtterance.volume = volume;
          
          fallbackUtterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
            console.log('English fallback speech synthesis started');
          };
          
          fallbackUtterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            console.log('English fallback speech synthesis ended');
          };
          
          fallbackUtterance.onerror = (fallbackEvent) => {
            console.error('All TTS fallbacks failed:', fallbackEvent.error);
            setIsSpeaking(false);
            setIsPaused(false);
          };
          
          speechSynthesis.speak(fallbackUtterance);
        }
      }
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, options.language, rate, pitch, volume]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  const setRate = useCallback((newRate: number) => {
    setRateState(Math.max(0.1, Math.min(10, newRate)));
  }, []);

  const setPitch = useCallback((newPitch: number) => {
    setPitchState(Math.max(0, Math.min(2, newPitch)));
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  // Load voices when component mounts and when voices change
  useState(() => {
    if (isSupported) {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  });

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    availableVoices: voices
  };
}
