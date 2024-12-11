import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly userKey = 'user';

  constructor() {}

  /**
   * Check if localStorage is available (browser environment).
   * This avoids errors during SSR or environments where localStorage is unavailable.
   */
  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  /**
   * Set data in localStorage.
   * @param key The key to store the data under.
   * @param value The data to store.
   */
  setItem(key: string, value: any): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this environment.');
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item in localStorage for key "${key}":`, error);
    }
  }

  /**
   * Get data from localStorage.
   * @param key The key to retrieve the data from.
   * @returns The parsed data or null if not found or ineligible environment.
   */
  getItem(key: string): any {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this environment.');
      return null;
    }
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to get item from localStorage for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove data from localStorage.
   * @param key The key to remove the data for.
   */
  removeItem(key: string): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this environment.');
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item from localStorage for key "${key}":`, error);
    }
  }

  /**
   * Clear all data from localStorage.
   */
  clear(): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this environment.');
      return;
    }
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Save the user object to localStorage.
   * @param user The user object to store.
   */
  setUser(user: UserModel): void {
    this.setItem(this.userKey, user);
  }

  /**
   * Retrieve the user object from localStorage.
   * @returns The user object or null if not found or parse error occurs.
   */
  getUser(): UserModel | null {
    return this.getItem(this.userKey);
  }

  /**
   * Remove the user object from localStorage.
   */
  clearUser(): void {
    this.removeItem(this.userKey);
  }

  /**
   * Get token or other string-based data directly from localStorage.
   * @param key The key to retrieve the token from.
   * @returns The string value of the token or null if not found.
   */
  getToken(key: string): string | null {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this environment.');
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to retrieve token from localStorage for key "${key}":`, error);
      return null;
    }
  }
}
