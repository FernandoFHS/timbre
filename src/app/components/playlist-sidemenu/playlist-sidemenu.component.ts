import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChordSheetService } from '../../services/chord-sheet.service';
import { ChordSheet, Playlist } from '../../models/chord-sheet.model';
import { CreatePlaylistDialogComponent } from '../create-playlist-dialog/create-playlist-dialog.component';
import { CreateChordSheetDialogComponent } from '../create-chord-sheet-dialog/create-chord-sheet-dialog.component';
import { ChordSheetComponent } from '../chord-sheet/chord-sheet.component';

@Component({
  selector: 'app-playlist-sidemenu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DragDropModule,
    ChordSheetComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="over" 
                   class="sidenav"
                   [class.mobile]="isMobile"
                   [class.mobile-open]="isMobile && sidenav.opened"
                   (mouseenter)="!isMobile && showSidenav()"
                   (mouseleave)="!isMobile && hideSidenav()">
        <div class="sidenav-header">
          <h2 class="playlist-header">Playlists</h2>
          <button mat-icon-button *ngIf="isMobile" (click)="hideSidenav()">
            <mat-icon>close</mat-icon>
          </button>
          <button mat-icon-button *ngIf="!isMobile" (click)="openCreatePlaylistDialog()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        
        <mat-nav-list>
          <mat-list-item *ngFor="let playlist of playlists" 
                        (click)="selectPlaylist(playlist)"
                        [class.selected]="selectedPlaylist?.id === playlist.id">
            <mat-icon matListItemIcon>queue_music</mat-icon>
            <span matListItemTitle>{{ playlist.name }}</span>
          </mat-list-item>
        </mat-nav-list>

        <div class="sidenav-actions">
          <button mat-raised-button color="primary" (click)="openCreateChordSheetDialog()">
            <mat-icon>add</mat-icon>
            Nova Cifra
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <div *ngIf="selectedPlaylist && !selectedChordSheet" class="playlist-content">
          <div class="playlist-header">
            <h2>{{ selectedPlaylist.name }}</h2>
            <div class="playlist-actions">
              <button mat-icon-button *ngIf="selectedPlaylist.id === 'current'" 
                      (click)="clearCurrentPlaylist($event)"
                      matTooltip="Limpar playlist atual">
                <mat-icon>clear_all</mat-icon>
              </button>
              <button mat-icon-button (click)="sidenav.toggle()">
                <mat-icon>menu</mat-icon>
              </button>
            </div>
          </div>
          
          <div cdkDropList (cdkDropListDropped)="drop($event)" class="chord-sheet-list">
            <div *ngFor="let sheet of selectedPlaylist.chordSheets" 
                 cdkDrag 
                 class="chord-sheet-item"
                 (click)="openChordSheet(sheet)">
              <mat-icon cdkDragHandle>drag_indicator</mat-icon>
              <span>{{ sheet.title }} - {{ sheet.artist }}</span>
              <button mat-icon-button (click)="addToCurrentPlaylist($event, sheet)">
                <mat-icon>playlist_add</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="selectedChordSheet" class="chord-sheet-view">
          <button mat-icon-button class="back-button" (click)="closeChordSheet()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <app-chord-sheet 
            [chordSheet]="selectedChordSheet"
            (navigate)="navigatePlaylist($event)">
          </app-chord-sheet>

          <div class="navigation-controls">
            <button mat-fab color="primary" 
                    (click)="navigatePlaylist('previous')"
                    [disabled]="!canNavigatePrevious()">
              <mat-icon>navigate_before</mat-icon>
            </button>
            <button mat-fab color="primary" 
                    (click)="navigatePlaylist('next')"
                    [disabled]="!canNavigateNext()">
              <mat-icon>navigate_next</mat-icon>
            </button>
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }
    .sidenav {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 250px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
    }
    
    .sidenav.mobile {
      width: 100vw;
      height: 100vh;
      position: fixed;
      bottom: -100vh;
      left: 0;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
      border-radius: 16px 16px 0 0;
    }
    
    .sidenav.mobile.mobile-open {
      bottom: 0;
    }
    
    .sidenav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .sidenav-container {
        position: relative;
      }
      
      .sidenav-header {
        padding: 20px 16px;
      }
      
      .playlist-header {
        font-size: 24px;
      }
    }
    .playlist-header {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }
    .playlist-content {
      padding: 20px;
    }
    .playlist-content .playlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .playlist-actions {
      display: flex;
      gap: 8px;
    }
    .chord-sheet-list {
      margin-top: 20px;
    }
    .chord-sheet-item {
      display: flex;
      align-items: center;
      padding: 10px;
      background: white;
      border: 1px solid #ddd;
      margin-bottom: 8px;
      cursor: pointer;
      justify-content: space-between;
    }
    .chord-sheet-item mat-icon {
      margin-right: 8px;
      color: #666;
    }
    .selected {
      background-color: #e3f2fd;
    }
    .sidenav-actions {
      padding: 16px;
      margin-top: auto;
    }
    .chord-sheet-view {
      position: relative;
      padding: 20px;
    }
    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 1;
    }
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    .cdk-drag-placeholder {
      opacity: 0;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .chord-sheet-list.cdk-drop-list-dragging .chord-sheet-item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .navigation-controls {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 20px;
      z-index: 1000;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 10px 20px;
      border-radius: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
  `]
})
export class PlaylistSidemenuComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;
  selectedChordSheet: ChordSheet | null = null;
  isMobile = window.innerWidth < 768;

  constructor(
    private chordSheetService: ChordSheetService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.chordSheetService.getPlaylists().subscribe(playlists => {
      this.playlists = playlists;
      if (playlists.length > 0) {
        this.selectPlaylist(playlists[0]);
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  showSidenav() {
    if (this.sidenav) {
      this.sidenav.open();
    }
  }

  hideSidenav() {
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }

  selectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
    this.selectedChordSheet = null;
  }

  openChordSheet(sheet: ChordSheet) {
    this.selectedChordSheet = sheet;
  }

  closeChordSheet() {
    this.selectedChordSheet = null;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.selectedPlaylist) {
      moveItemInArray(
        this.selectedPlaylist.chordSheets,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openCreatePlaylistDialog() {
    const dialogRef = this.dialog.open(CreatePlaylistDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chordSheetService.createPlaylist(result.name, result.description)
          .subscribe(playlist => {
            this.playlists.push(playlist);
          });
      }
    });
  }

  openCreateChordSheetDialog() {
    const dialogRef = this.dialog.open(CreateChordSheetDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chordSheetService.createChordSheet(result)
          .subscribe();
      }
    });
  }

  addToCurrentPlaylist(event: Event, sheet: ChordSheet) {
    event.stopPropagation();
    this.chordSheetService.addToCurrentPlaylist(sheet);
  }

  clearCurrentPlaylist(event: Event) {
    event.stopPropagation();
    this.chordSheetService.clearCurrentPlaylist();
  }

  navigatePlaylist(direction: 'next' | 'previous') {
    if (!this.selectedPlaylist || !this.selectedChordSheet) return;

    const currentIndex = this.selectedPlaylist.chordSheets.findIndex(
      sheet => sheet.id === this.selectedChordSheet?.id
    );

    if (direction === 'next' && currentIndex < this.selectedPlaylist.chordSheets.length - 1) {
      this.selectedChordSheet = this.selectedPlaylist.chordSheets[currentIndex + 1];
    } else if (direction === 'previous' && currentIndex > 0) {
      this.selectedChordSheet = this.selectedPlaylist.chordSheets[currentIndex - 1];
    }
  }

  canNavigateNext(): boolean {
    if (!this.selectedPlaylist || !this.selectedChordSheet) return false;
    const currentIndex = this.selectedPlaylist.chordSheets.findIndex(
      sheet => sheet.id === this.selectedChordSheet?.id
    );
    return currentIndex < this.selectedPlaylist.chordSheets.length - 1;
  }

  canNavigatePrevious(): boolean {
    if (!this.selectedPlaylist || !this.selectedChordSheet) return false;
    const currentIndex = this.selectedPlaylist.chordSheets.findIndex(
      sheet => sheet.id === this.selectedChordSheet?.id
    );
    return currentIndex > 0;
  }
}