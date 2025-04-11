import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PlaylistSidemenuComponent } from './app/components/playlist-sidemenu/playlist-sidemenu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChordSheet } from './app/models/chord-sheet.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PlaylistSidemenuComponent, MatIconModule, MatButtonModule],
  template: `
    <div class="app-container">
      <header>
        <h1>Timbre</h1>
        <button mat-icon-button>
          <mat-icon>account_circle</mat-icon>
        </button>
      </header>
      <app-playlist-sidemenu></app-playlist-sidemenu>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background-color: #2196f3;
      color: white;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
    }
    header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    app-playlist-sidemenu {
      flex: 1;
      display: block;
    }
  `]
})
export class App {
  sampleChordSheet: ChordSheet = {
    id: '1',
    title: 'Wonderwall',
    artist: 'Oasis',
    category: 'Entrada',
    content: '[Em7] Today is [G] gonna be the day\nThat they\'re [D] gonna throw it back to [A7sus4] you',
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

bootstrapApplication(App, {
  providers: [
    provideRouter([]),
    provideAnimations()
  ]
}).catch(err => console.error(err));