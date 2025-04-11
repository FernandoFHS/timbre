import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-playlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Criar Nova Playlist</h2>
    <mat-dialog-content>
      <form #playlistForm="ngForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput [(ngModel)]="name" name="name" required>
        </mat-form-field>
        
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput [(ngModel)]="description" name="description"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="!playlistForm.form.valid"
              (click)="onSubmit()">
        Criar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
  `]
})
export class CreatePlaylistDialogComponent {
  name: string = '';
  description: string = '';

  constructor(private dialogRef: MatDialogRef<CreatePlaylistDialogComponent>) {}

  onSubmit(): void {
    this.dialogRef.close({
      name: this.name,
      description: this.description
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}