import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/chord-sheet.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Mock user for development
    this.setMockUser();
  }

  private setMockUser() {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User'
    };
    this.currentUserSubject.next(mockUser);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}