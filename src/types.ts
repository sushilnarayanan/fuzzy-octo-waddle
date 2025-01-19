export interface Developer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourlyRate: number;
  bio: string;
  availability: boolean;
  rating: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed';
  clientId: string;
  developerId?: string;
  createdAt: string;
  category: 'build' | 'debug' | 'learn';
  timeframe: string;
}