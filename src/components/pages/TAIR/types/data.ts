// src/types/data.ts 

export interface TeamMember {
  name: string;
  role: string;
  subRole: string;
  image?: string;
  phone?: string;
  email?: string;
  duty?: string; 
}

export interface Venue {
  name: string;
  addressLine1: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface EventListing {
  title: string;
  tag: string;
  description: string;
  date: string;
  location: string;
  time: string;
}