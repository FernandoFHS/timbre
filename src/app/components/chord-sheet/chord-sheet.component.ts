import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChordCircleComponent } from '../chord-circle/chord-circle.component';
import { EditChordSheetDialogComponent } from '../edit-chord-sheet-dialog/edit-chord-sheet-dialog.component';
import { ChordSheet } from '../../models/chord-sheet.model';
import { ChordSheetService } from '../../services/chord-sheet.service';
import { ChordFormatterService } from '../../services/chord-formatter.service';

@Component({
  selector: 'app-chord-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    ChordCircleComponent
  ],
  template: `
    <div class="chord-sheet">
      <div class="header">
        <div class="title-section">
          <h1 class="title">{{ chordSheet.title }}</h1>
          <h2 class="artist">{{ chordSheet.artist }}</h2>
          <div class="category">{{ chordSheet.category }}</div>
        </div>

        <div class="actions">
          <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Configurações">
            <mat-icon>settings</mat-icon>
          </button>
          
          <button mat-icon-button [matMenuTriggerFor]="moreMenu" matTooltip="Mais opções">
            <mat-icon>more_vert</mat-icon>
          </button>

          <mat-menu #menu="matMenu" class="transpose-menu">
            <div class="chord-circles">
              <app-chord-circle
                *ngFor="let chord of chords"
                [chord]="chord"
                [isOriginalKey]="chord === originalKey"
                [isCurrentKey]="chord === currentKey"
                (click)="transposeTo(chord)">
              </app-chord-circle>
            </div>
          </mat-menu>

          <mat-menu #moreMenu="matMenu">
            <button mat-menu-item (click)="editChordSheet()">
              <mat-icon>edit</mat-icon>
              <span>Editar</span>
            </button>
            <button mat-menu-item (click)="addToCurrent()">
              <mat-icon>playlist_add</mat-icon>
              <span>Adicionar à playlist atual</span>
            </button>
          </mat-menu>
        </div>
      </div>
      
      <div class="content-wrapper">
        <div class="content" [innerHTML]="formattedContent"></div>
      </div>
    </div>
  `,
  styles: [`
    .chord-sheet {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
      position: relative;
    }
    .title {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #2196f3;
    }
    .artist {
      font-size: 1.5rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    .category {
      font-size: 1rem;
      color: #888;
      font-style: italic;
      margin-bottom: 1rem;
    }
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
    .content {
      font-family: monospace;
      white-space: pre-wrap;
      line-height: 1.6;
      font-size: 1.1rem;
    }
    .chord-line {
      color: #2196f3;
      font-weight: bold;
      min-height: 1.5em;
    }
    .lyric-line {
      margin-bottom: 1em;
    }
    .add-to-current {
      position: absolute;
      top: 0;
      right: 0;
    }
    .content-wrapper {
      max-height: calc(100vh - 250px); /* Ajustado para dar espaço aos botões de navegação */
      overflow-y: auto;
      padding-right: 16px;
      margin-bottom: 80px; /* Espaço para os botões de navegação */
    }
    .actions {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      gap: 8px;
    }
    .chord-circles {
      display: flex;
      flex-wrap: wrap;
      max-width: 280px;
      padding: 8px;
    }
    .title-section {
      flex: 1;
      text-align: center;
    }
    ::ng-deep .transpose-menu {
      min-width: 300px !important;
    }
  `]
})
export class ChordSheetComponent implements OnInit {
  @Input() chordSheet!: ChordSheet;
  @Output() navigate = new EventEmitter<'next' | 'previous'>();

  chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
            'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'];
  originalKey: string = '';
  currentKey: string = '';

  constructor(
    private dialog: MatDialog,
    private chordSheetService: ChordSheetService,
    private chordFormatter: ChordFormatterService
  ) {}

  ngOnInit() {
    if (this.chordSheet) {
      this.originalKey = this.chordSheet.key || this.detectFirstChord();
      this.currentKey = this.originalKey;
    }
  }

  get formattedContent(): string {
    return this.chordFormatter.formatChordSheet(this.chordSheet.content);
  }

  private detectFirstChord(): string {
    if (!this.chordSheet?.content) return 'C';
    const match = this.chordSheet.content.match(/\[([^\]]+)\]/);
    return match ? match[1] : 'C';
  }

  transposeTo(targetKey: string): void {
    const semitones = this.calculateSemitones(this.currentKey, targetKey);
    this.chordSheet.content = this.chordFormatter.transposeContent(
      this.chordSheet.content,
      semitones
    );
    this.currentKey = targetKey;
  }

  private calculateSemitones(from: string, to: string): number {
    const fromIndex = this.chords.indexOf(from);
    const toIndex = this.chords.indexOf(to);
    return toIndex - fromIndex;
  }

  nextSong(): void {
    this.navigate.emit('next');
  }

  previousSong(): void {
    this.navigate.emit('previous');
  }

  editChordSheet(): void {
    const dialogRef = this.dialog.open(EditChordSheetDialogComponent, {
      width: '600px',
      data: this.chordSheet
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(this.chordSheet, result);
      }
    });
  }

  addToCurrent(): void {
    this.chordSheetService.addToCurrentPlaylist(this.chordSheet);
  }
}