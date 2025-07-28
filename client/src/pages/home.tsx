import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ThreeBackground from '@/components/ThreeBackground';
import ScenarioSelector from '@/components/ScenarioSelector';
import VoiceChat from '@/components/VoiceChat';
import { apiRequest } from '@/lib/queryClient';
import { scenarios, type Scenario } from '@/utils/scenarios';
import type { ChatSession } from '@shared/schema';

type AppState = 'landing' | 'scenarios' | 'chat';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Create chat session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (scenario: string) => {
      const response = await apiRequest('POST', '/api/chat/sessions', {
        scenario,
        language: 'en-US'
      });
      return response.json() as Promise<ChatSession>;
    },
    onSuccess: (session) => {
      setCurrentSessionId(session.id);
      setAppState('chat');
    }
  });

  const handleStartFreeChat = () => {
    createSessionMutation.mutate('free-chat');
  };

  const handleSelectScenario = (scenario: Scenario) => {
    createSessionMutation.mutate(scenario.id);
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setCurrentSessionId(null);
  };

  const handleBrowseScenarios = () => {
    setAppState('scenarios');
  };

  if (appState === 'chat' && currentSessionId) {
    return <VoiceChat sessionId={currentSessionId} onBack={handleBackToLanding} />;
  }

  if (appState === 'scenarios') {
    return (
      <div className="min-h-screen text-white"
        style={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)'
        }}>
        {/* Header */}
        <header className="fixed top-0 w-full z-50 glass-morphism">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <i className="fas fa-magic text-white text-xl"></i>
                </div>
                <h1 className="text-2xl font-bold letter-spacing-wide text-shadow-glow">SPEAKGENIE</h1>
              </div>
              <button
                onClick={handleBackToLanding}
                className="px-6 py-2 glass-morphism rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <i className="fas fa-home mr-2"></i>Home
              </button>
            </div>
          </div>
        </header>

        <div className="pt-20">
          <ScenarioSelector onSelectScenario={handleSelectScenario} />
        </div>
      </div>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)'
      }}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-morphism">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-magic text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold letter-spacing-wide text-shadow-glow">SPEAKGENIE</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button className="px-4 py-2 rounded-lg glass-morphism hover:bg-white/20 transition-all duration-300">
                <i className="fas fa-language mr-2"></i>EN/HI
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                <i className="fas fa-user mr-2"></i>Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ThreeBackground />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Main headline with letter spacing effect */}
          <h2 className="text-6xl md:text-8xl font-black letter-spacing-wider text-shadow-glow mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI VOICE TUTOR
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 letter-spacing-wide">
            Real-time conversation practice for kids aged 6-16
          </p>

          {/* Interactive 3D cubes that respond to voice */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="cube-3d w-24 h-24 cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="cube-face bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-microphone text-white text-2xl"></i>
              </div>
            </div>
            <div className="cube-3d w-24 h-24 cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="cube-face bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-theater-masks text-white text-2xl"></i>
              </div>
            </div>
            <div className="cube-3d w-24 h-24 cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="cube-face bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-cog text-white text-2xl"></i>
              </div>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={handleStartFreeChat}
              disabled={createSessionMutation.isPending}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              <i className="fas fa-comments mr-3"></i>
              {createSessionMutation.isPending ? 'Starting...' : 'Start Free Chat'}
            </button>
            <button 
              onClick={handleBrowseScenarios}
              className="px-8 py-4 glass-morphism rounded-xl text-lg font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
            >
              <i className="fas fa-play mr-3"></i>Browse Scenarios
            </button>
          </div>
        </div>

        {/* Floating Genie avatar */}
        <div className="absolute bottom-10 right-10 w-20 h-20 animate-float">
          <div className="w-full h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg" id="genieAvatar">
            <i className="fas fa-user-astronaut text-white text-2xl"></i>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16" 
        style={{
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)'
        }}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="mb-12">
              <h4 className="text-4xl font-black letter-spacing-wider text-shadow-glow mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  READY TO START?
                </span>
              </h4>
              <div className="text-xl text-gray-400 letter-spacing-wide">Begin your AI voice learning journey</div>
            </div>

            <div className="mb-12">
              <button 
                onClick={handleStartFreeChat}
                disabled={createSessionMutation.isPending}
                className="px-12 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl text-xl font-bold letter-spacing-wide hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
              >
                {createSessionMutation.isPending ? 'STARTING...' : 'START SPEAKGENIE'}
              </button>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-500">
                <div>
                  <h5 className="font-semibold mb-3 letter-spacing-wide">TECHNOLOGY</h5>
                  <ul className="space-y-2">
                    <li>Google Gemini AI</li>
                    <li>Web Speech API</li>
                    <li>React + Tailwind</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 letter-spacing-wide">FEATURES</h5>
                  <ul className="space-y-2">
                    <li>Real-time Voice Chat</li>
                    <li>Interactive Roleplay</li>
                    <li>Multilingual Support</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 letter-spacing-wide">SUPPORT</h5>
                  <ul className="space-y-2">
                    <li>Ages 6-16</li>
                    <li>Kid-Safe Content</li>
                    <li>24/7 Available</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <p className="text-gray-500 letter-spacing-wide">
                  © SpeakGenie 2025 - Inspired by Lotipa Design Aesthetics
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
