export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  dishCount: number;
  status: 'published' | 'pending' | 'draft';
  image: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  // Availability state shown by the menu-editor dish-row segmented control.
  // Transcribed from each `.item[data-status]` in app/menu-editor.html.
  availability: 'available' | 'soldout' | 'unavailable';
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  avatar: string;
  // Join date shown in the team.html Members table (whitespace-nowrap tabular-nums column).
  joined: string;
}
