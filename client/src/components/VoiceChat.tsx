import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { apiRequest } from '@/lib/queryClient';
import type { ChatMessage, ChatSession } from '@shared/schema';

interface VoiceChatProps {
  sessionId: string;
  onBack: () => void;
}

export default function VoiceChat({ sessionId, onBack }: VoiceChatProps) {
  const [language, setLanguage] = useState('en-US');
  const [audioLevel, setAudioLevel] = useState(0);
  const queryClient = useQueryClient();

  // Get chat session
  const { data: session } = useQuery<ChatSession>({
    queryKey: ['/api/chat/sessions', sessionId],
  });

  // Get chat messages
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/sessions', sessionId, 'messages'],
  });

  // Speech recognition
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechSupported,
    error: speechError
  } = useSpeechRecognition({
    language,
    continuous: false,
    interimResults: false
  });

  // Speech synthesis
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    setRate,
    setPitch
  } = useSpeechSynthesis({
    language,
    rate: 1.0,
    pitch: 1.1
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', `/api/chat/sessions/${sessionId}/messages`, {
        sender: 'user',
        message
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate messages to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions', sessionId, 'messages'] });
      
      // Speak the AI response
      if (data.aiMessage?.message) {
        speak(data.aiMessage.message);
      }
    }
  });

  // Handle speech recognition result
  useEffect(() => {
    if (transcript && !isListening) {
      sendMessageMutation.mutate(transcript);
      resetTranscript();
    }
  }, [transcript, isListening]);

  // Animate avatar when speaking
  useEffect(() => {
    const avatar = document.getElementById('genieAvatar');
    if (avatar) {
      if (isSpeaking) {
        avatar.classList.add('animate-bounce');
      } else {
        avatar.classList.remove('animate-bounce');
      }
    }
  }, [isSpeaking]);

  // Simulate audio level visualization
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      // Dispatch custom event for cube animations
      window.dispatchEvent(new CustomEvent('voice-end'));
    } else {
      startListening();
      // Dispatch custom event for cube animations
      window.dispatchEvent(new CustomEvent('voice-start'));
    }
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!speechSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Speech Recognition Not Supported</h2>
          <p className="text-gray-400">Your browser doesn't support speech recognition. Please use a modern browser like Chrome.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-20 bg-gray-900 min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)'
      }}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="px-6 py-2 glass-morphism rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back
            </button>
            <div className="text-center">
              <h3 className="text-4xl md:text-6xl font-black letter-spacing-wide text-shadow-glow mb-2">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {session?.scenario.toUpperCase() || 'VOICE CHAT'}
                </span>
              </h3>
              <p className="text-xl text-gray-400 letter-spacing-wide">Experience real-time AI conversation</p>
            </div>
            <div></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat messages area */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-3xl p-8 h-96 overflow-y-auto mb-6">
                {messages.map((message) => (
                  <div key={message.id} className="mb-6">
                    {message.sender === 'user' ? (
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-white text-sm"></i>
                        </div>
                        <div className="glass-morphism rounded-2xl p-4 max-w-xs">
                          <p>{message.message}</p>
                          <span className="text-xs text-gray-400 mt-2 block">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-4 flex-row-reverse">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-magic text-white text-sm"></i>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-4 max-w-xs">
                          <p>{message.message}</p>
                          <span className="text-xs text-emerald-200 mt-2 block">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {sendMessageMutation.isPending && (
                  <div className="flex items-start space-x-4 flex-row-reverse">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-magic text-white text-sm animate-spin"></i>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-4 max-w-xs">
                      <p>Thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice input controls */}
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={handleVoiceToggle}
                  disabled={sendMessageMutation.isPending}
                  className={`w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 ${
                    isListening 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                >
                  <i className="fas fa-microphone text-white text-xl"></i>
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-400 mb-2">
                    {isListening ? 'Listening...' : 'Press to speak'}
                  </span>
                  <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {speechError && (
                <div className="mt-4 p-4 bg-red-500/20 rounded-lg text-red-300 text-center">
                  {speechError}
                </div>
              )}
            </div>

            {/* Controls and status panel */}
            <div className="space-y-6">
              {/* Current mode indicator */}
              <div className="glass-morphism rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 letter-spacing-wide">CURRENT MODE</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>{session?.scenario || 'Free Chat'}</span>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {session?.scenario === 'school' && 'Practice classroom conversations'}
                    {session?.scenario === 'store' && 'Practice shopping interactions'}
                    {session?.scenario === 'restaurant' && 'Practice ordering food'}
                    {session?.scenario === 'airport' && 'Practice travel conversations'}
                    {session?.scenario === 'home' && 'Practice family conversations'}
                    {session?.scenario === 'free-chat' && 'Open conversation practice'}
                  </div>
                </div>
              </div>

              {/* Language selection */}
              <div className="glass-morphism rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 letter-spacing-wide">VOICE LANGUAGE</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLanguage('en-US')}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      language === 'en-US' 
                        ? 'bg-indigo-500 hover:bg-indigo-600' 
                        : 'glass-morphism hover:bg-white/20'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => setLanguage('hi-IN')}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      language === 'hi-IN' 
                        ? 'bg-indigo-500 hover:bg-indigo-600' 
                        : 'glass-morphism hover:bg-white/20'
                    }`}
                  >
                    🇮🇳 Hindi
                  </button>
                </div>
              </div>

              {/* Voice settings */}
              <div className="glass-morphism rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 letter-spacing-wide">VOICE SETTINGS</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Speech Rate</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      defaultValue="1" 
                      className="w-full"
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Voice Pitch</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      defaultValue="1.1" 
                      className="w-full"
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="glass-morphism rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 letter-spacing-wide">QUICK ACTIONS</h4>
                <div className="space-y-3">
                  <button 
                    onClick={stopSpeaking}
                    className="w-full p-3 bg-purple-500 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                  >
                    <i className="fas fa-stop mr-2"></i>Stop Speaking
                  </button>
                  <button 
                    onClick={onBack}
                    className="w-full p-3 glass-morphism rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>Change Scenario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Genie avatar */}
      <div className="fixed bottom-10 right-10 w-20 h-20 animate-float">
        <div 
          className="w-full h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg" 
          id="genieAvatar"
        >
          <i className="fas fa-user-astronaut text-white text-2xl"></i>
        </div>
      </div>
    </section>
  );
}
