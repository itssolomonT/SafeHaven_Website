export interface Brand {
  id: string;
  name: string;
  displayName: string;
  states: string[];
  zipCodes: string[];
  phoneNumber: string;
  website: string;
  colors: BrandColors;
  logo: string;
  ctaText: string;
  ctaColor: string;
  description: string;
  features: string[];
  testimonials: Testimonial[];
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
}

export interface Lead {
  id: string;
  brandId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  address?: string;
  source: LeadSource;
  utmParams?: UTMParams;
  sessionId: string;
  createdAt: Date;
  status: LeadStatus;
  notes?: string;
}

export interface LeadSource {
  type: 'organic' | 'paid' | 'direct' | 'referral' | 'door-knocking';
  campaign?: string;
  medium?: string;
  source?: string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';

export interface Session {
  id: string;
  brandId: string;
  zipCode: string;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  utmParams?: UTMParams;
  createdAt: Date;
  lastActivity: Date;
  isReturnVisitor: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface LocationData {
  zipCode: string;
  city: string;
  state: string;
  county: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ServiceArea {
  brandId: string;
  zipCodes: string[];
  states: string[];
  isActive: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 