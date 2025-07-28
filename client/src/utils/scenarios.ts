export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  examples: string[];
}

export const scenarios: Scenario[] = [
  {
    id: 'school',
    name: 'SCHOOL',
    description: 'Classroom conversations and presentations',
    icon: 'fas fa-school',
    gradient: 'from-blue-500 to-indigo-500',
    examples: [
      'Asking questions in class',
      'Giving presentations',
      'Talking to teachers',
      'Making friends'
    ]
  },
  {
    id: 'store',
    name: 'STORE',
    description: 'Shopping and customer service interactions',
    icon: 'fas fa-shopping-cart',
    gradient: 'from-emerald-500 to-cyan-500',
    examples: [
      'Asking about products',
      'Checking prices',
      'Making purchases',
      'Getting help from staff'
    ]
  },
  {
    id: 'restaurant',
    name: 'RESTAURANT',
    description: 'Ordering food and dining etiquette',
    icon: 'fas fa-utensils',
    gradient: 'from-orange-500 to-red-500',
    examples: [
      'Ordering meals',
      'Asking about menu items',
      'Making special requests',
      'Paying the bill'
    ]
  },
  {
    id: 'airport',
    name: 'AIRPORT',
    description: 'Travel and navigation conversations',
    icon: 'fas fa-plane',
    gradient: 'from-purple-500 to-pink-500',
    examples: [
      'Checking in for flights',
      'Going through security',
      'Asking for directions',
      'Handling luggage'
    ]
  },
  {
    id: 'home',
    name: 'HOME',
    description: 'Family conversations and daily routines',
    icon: 'fas fa-home',
    gradient: 'from-yellow-500 to-orange-500',
    examples: [
      'Talking with family',
      'Discussing daily activities',
      'Planning weekend fun',
      'Sharing stories'
    ]
  }
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find(scenario => scenario.id === id);
};
