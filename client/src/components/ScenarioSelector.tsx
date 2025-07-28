import { scenarios, type Scenario } from '@/utils/scenarios';

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: Scenario) => void;
}

export default function ScenarioSelector({ onSelectScenario }: ScenarioSelectorProps) {
  return (
    <section className="relative py-20" 
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)'
      }}>
      <div className="container mx-auto px-6">
        {/* Award-winning projects style header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <div className="letter-spacing-wider text-sm text-gray-400 mb-4">© Selected scenarios 22 — 25</div>
            <h3 className="text-6xl md:text-8xl font-black letter-spacing-wider text-shadow-glow">
              <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                ROLEPLAY MODES
              </span>
            </h3>
          </div>
          
          {/* Repeating text like Lotipa */}
          <div className="overflow-hidden mb-12">
            <div className="flex animate-pulse-slow">
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i} className="text-2xl font-bold text-gray-600 mr-8 letter-spacing-wide whitespace-nowrap">
                  INTERACTIVE SCENARIOS
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Index-style scenario grid */}
        <div className="max-w-6xl mx-auto">
          {scenarios.map((scenario, index) => (
            <div 
              key={scenario.id}
              className="mb-12 group cursor-pointer"
              onClick={() => onSelectScenario(scenario)}
            >
              <div className="grid md:grid-cols-4 gap-6 items-center glass-morphism rounded-3xl p-8 hover:bg-white/10 transition-all duration-500">
                <div className="md:col-span-1">
                  <div className={`w-32 h-20 bg-gradient-to-r ${scenario.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${scenario.icon} text-white text-2xl`}></i>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-2xl font-bold mb-2 letter-spacing-wide">{scenario.name}</h4>
                  <p className="text-gray-400 mb-4">{scenario.description}</p>
                  <div className="text-sm text-gray-500">2025</div>
                </div>
                <div className="md:col-span-1 text-right">
                  <div className="text-sm text-gray-400 mb-2">[ {String(index + 1).padStart(2, '0')} ]</div>
                  <button className={`px-6 py-2 bg-gradient-to-r ${scenario.gradient} rounded-lg hover:scale-105 transition-all duration-300`}>
                    Go
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
