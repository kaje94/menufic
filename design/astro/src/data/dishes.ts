import type { Dish } from './types';

// Transcribed from design/landing/app/menu-editor.html (Saffron & Smoke, Dinner menu:
// Mains, Small plates, Sides categories). No per-dish tags are present in the source —
// the "Tags" field in the item edit panel is a generic, unassigned control (Popular/New/
// Chef's Special/Spicy), not data tied to any specific dish.
export const dishes: Dish[] = [
  {
    id: 'smoked-short-rib',
    name: 'Smoked short rib',
    description: '36-hour cook, burnt-honey glaze',
    price: '$28',
    image: '/img/photo-1432139555190-58524dae6a55.jpg',
    availability: 'available',
  },
  {
    id: 'wood-fired-margherita',
    name: 'Wood-fired margherita',
    description: 'San Marzano, basil oil',
    price: '$19',
    image: '/img/photo-1565299624946-b28f40a0ae38.jpg',
    availability: 'available',
  },
  {
    id: 'saffron-prawns',
    name: 'Saffron prawns',
    description: 'chilli butter, charred lemon',
    price: '$22',
    image: '/img/photo-1484723091739-30a097e8f929.jpg',
    availability: 'soldout',
  },
  {
    id: 'red-shrimp-broth',
    name: 'Red shrimp broth',
    description: 'smoked tomato, fennel',
    price: '$16',
    image: '/img/photo-1455619452474-d2be8b1e70cd.jpg',
    availability: 'available',
  },
  {
    id: 'charred-sharing-board',
    name: 'Charred sharing board',
    description: 'for the table',
    price: '$24',
    image: '/img/photo-1424847651672-bf20a4b0982b.jpg',
    availability: 'available',
  },
  {
    id: 'burnt-honey-carrots',
    name: 'Burnt-honey carrots',
    description: 'cumin, whipped feta',
    price: '$9',
    image: '/img/photo-1414235077428-338989a2e8c0.jpg',
    availability: 'available',
  },
  {
    id: 'sourdough-cultured-butter',
    name: 'Sourdough & cultured butter',
    description: 'baked in-house daily',
    price: '$6',
    image: '/img/photo-1424847651672-bf20a4b0982b.jpg',
    availability: 'unavailable',
  },
];
