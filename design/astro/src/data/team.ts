import type { TeamMember } from './types';

// Transcribed from design/landing/app/team.html (Members table, Saffron & Smoke).
// NOTE: the source uses three role badges — Owner, Editor, Viewer — but the TeamMember
// type only allows 'Owner' | 'Manager' | 'Editor' (no 'Viewer'). Priya Nair's source role
// ("Viewer") is mapped to 'Manager' here so the fixture set exercises all three type
// values; flagged in task-3-report.md as an assumption to confirm.
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
    role: 'Manager', // source badge reads "Viewer" — see note above
    avatar: '/img/photo-1438761681033-6461ffad8d80.jpg',
  },
];
