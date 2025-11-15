export const CUISINES = [
  { id: '1', name: 'Italian', emoji: '🇮🇹', popular: true },
  { id: '2', name: 'Mexican', emoji: '🇲🇽', popular: true },
  { id: '3', name: 'Chinese', emoji: '🇨🇳', popular: true },
  { id: '4', name: 'Japanese', emoji: '🇯🇵', popular: true },
  { id: '5', name: 'Indian', emoji: '🇮🇳', popular: true },
  { id: '6', name: 'Thai', emoji: '🇹🇭', popular: true },
  { id: '7', name: 'French', emoji: '🇫🇷', popular: false },
  { id: '8', name: 'Greek', emoji: '🇬🇷', popular: false },
  { id: '9', name: 'Spanish', emoji: '🇪🇸', popular: false },
  { id: '10', name: 'Korean', emoji: '🇰🇷', popular: true },
  { id: '11', name: 'Vietnamese', emoji: '🇻🇳', popular: false },
  { id: '12', name: 'Lebanese', emoji: '🇱🇧', popular: false },
  { id: '13', name: 'Turkish', emoji: '🇹🇷', popular: false },
  { id: '14', name: 'Brazilian', emoji: '🇧🇷', popular: false },
  { id: '15', name: 'American', emoji: '🇺🇸', popular: true },
];

export const POPULAR_CUISINES = CUISINES.filter(c => c.popular);
