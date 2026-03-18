import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Set item in local storage
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to local storage', error);
    }
  }

  // Get item from local storage
  getItem(key: string): any {
    try {
      const storedItem = localStorage.getItem(key);
      return storedItem ? JSON.parse(storedItem) : null;
    } catch (error) {
      console.error('Error getting from local storage', error);
      return null;
    }
  }

  // Remove item from local storage
  removeItem(key: string): any {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from local storage', error);
      return false;
    }
  }

  // Clear all local storage
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing local storage', error);
    }
  }
}
