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
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  avatar: string;
}
