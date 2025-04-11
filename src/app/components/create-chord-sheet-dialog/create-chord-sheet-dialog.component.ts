import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SongCategory } from '../../models/chord-sheet.model';

@Component({
  selector: 'app-create-chord-sheet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Criar Nova Cifra</h2>
    <mat-dialog-content>
      <form #chordSheetForm="ngForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput [(ngModel)]="title" name="title" required>
        </mat-form-field>
        
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Artista</mat-label>
          <input matInput [(ngModel)]="artist" name="artist" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Categoria</mat-label>
          <mat-select [(ngModel)]="category" name="category" required>
            <mat-option value="Entrada">Entrada</mat-option>
            <mat-option value="Ato Penitencial">Ato Penitencial</mat-option>
            <mat-option value="Hino de Louvor">Hino de Louvor</mat-option>
            <mat-option value="Aclamação ao Evangelho">Aclamação ao Evangelho</mat-option>
            <mat-option value="Ofertório">Ofertório</mat-option>
            <mat-option value="Santo">Santo</mat-option>
            <mat-option value="Cordeiro">Cordeiro</mat-option>
            <mat-option value="Comunhão">Comunhão</mat-option>
            <mat-option value="Pós-Comunhão">Pós-Comunhão</mat-option>
            <mat-option value="Final">Final</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Conteúdo</mat-label>
          <textarea matInput [(ngModel)]="content" name="content" required rows="10"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="!chordSheetForm.form.valid"
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
export class CreateChordSheetDialogComponent {
  title: string = '';
  artist: string = '';
  content: string = '';
  category: SongCategory = 'Entrada';

  constructor(private dialogRef: MatDialogRef<CreateChordSheetDialogComponent>) {}

  onSubmit(): void {
    this.dialogRef.close({
      title: this.title,
      artist: this.artist,
      content: this.content,
      category: this.category,
      createdBy: '1'
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}