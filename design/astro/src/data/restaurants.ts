import type { Restaurant } from './types';

// Transcribed from design/landing/app/dashboard.html (restaurant cards, ~lines 82-170).
export const restaurants: Restaurant[] = [
  {
    id: 'saffron-smoke',
    name: 'Saffron & Smoke',
    cuisine: 'Modern grill',
    location: 'Downtown',
    dishCount: 42,
    status: 'published',
    image: '/img/photo-1432139555190-58524dae6a55.jpg',
  },
  {
    id: 'bella-trattoria',
    name: 'Bella Trattoria',
    cuisine: 'Italian',
    location: 'Since 1998',
    dishCount: 28,
    status: 'published',
    image: '/img/photo-1565299624946-b28f40a0ae38.jpg',
  },
  {
    id: 'verde-kitchen',
    name: 'Verde Kitchen',
    cuisine: 'All-day brunch',
    location: 'Riverside',
    dishCount: 19,
    status: 'pending',
    image: '/img/photo-1517248135467-4c7edcad34c4.jpg',
  },
];

export const owner = {
  name: 'Arun Kajendran',
  email: 'a.kajendran@gmail.com',
  avatar: '/img/photo-1507003211169-0a1dd7228f2d.jpg',
};
