// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  college?: string;
  yearOfStudy?: string;
  rollNumber?: string;
  createdAt: string;
}

// Note: AuthResponse, RegisterData, and LoginData removed
// Authentication is now handled by Clerk, these types are no longer needed

/**
 * API Service Class
 */
class ApiService {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage
    this.accessToken = localStorage.getItem('accessToken');
  }

  /**
   * Set access token
   */
  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  /**
   * Clear access token
   */
  clearToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add custom headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // Add auth token if available
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Note: Registration and login are now handled by Clerk authentication
  // These methods have been removed as they are no longer needed

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await this.request<User>('/auth/profile');

    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<Pick<User, 'fullName' | 'phone' | 'college' | 'yearOfStudy' | 'rollNumber'>>): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }

    throw new Error(response.message || 'Failed to update profile');
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearToken();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Create and export API instance
export const api = new ApiService(API_BASE_URL);
