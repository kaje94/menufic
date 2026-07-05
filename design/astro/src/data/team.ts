import type { TeamMember } from './types';

// Transcribed from design/landing/app/team.html (Members table, Saffron & Smoke).
// The source uses three role badges — Owner, Editor, Viewer — matched exactly below.
export const team: TeamMember[] = [
  {
    id: 'arun-kajendran',
    name: 'Arun Kajendran',
    email: 'a.kajendran@gmail.com',
    role: 'Owner',
    avatar: '/img/photo-1507003211169-0a1dd7228f2d.jpg',
  },
  {
    id: 'maria-conti',
    name: 'Maria Conti',
    email: 'maria@saffronsmoke.com',
    role: 'Editor',
    avatar: '/img/photo-1494790108377-be9c29b29330.jpg',
  },
  {
    id: 'daniel-okafor',
    name: 'Daniel Okafor',
    email: 'daniel@saffronsmoke.com',
    role: 'Editor',
    // Source HTML reuses the owner's photo for Daniel Okafor's avatar (team.html:326)
    // — transcribed as-is for fidelity, not a transcription error.
    avatar: '/img/photo-1507003211169-0a1dd7228f2d.jpg',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    email: 'priya@saffronsmoke.com',
    role: 'Viewer',
    avatar: '/img/photo-1438761681033-6461ffad8d80.jpg',
  },
];
