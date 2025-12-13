export interface Review {
  reviewer: string;
  rating: number;
  comment: string;
}

export interface Psychologist {
  id?: string; // Firebase Key or index
  name: string;
  avatar_url: string;
  experience: string;
  reviews: Review[];
  price_per_hour: number;
  rating: number;
  license: string;
  specialization: string;
  initial_consultation: string;
  about: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  favorites: string[]; // Array of Psychologist names or IDs
}

export interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  comment: string;
  time: string;
}

export enum FilterType {
  A_TO_Z = 'A to Z',
  Z_TO_A = 'Z to A',
  PRICE_LOW = 'Less than 10$', // Keeping label from design, but logic will be Ascending
  PRICE_HIGH = 'Greater than 10$', // Descending
  RATING_LOW = 'Not popular',
  RATING_HIGH = 'Popular',
  SHOW_ALL = 'Show all',
}