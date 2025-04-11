import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ChordSheet, SongCategory } from '../../models/chord-sheet.model';

@Component({
  selector: 'app-edit-chord-sheet-dialog',
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
    <h2 mat-dialog-title>Editar Cifra</h2>
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

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Tom</mat-label>
          <input matInput [(ngModel)]="key" name="key" placeholder="Opcional">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="!chordSheetForm.form.valid"
              (click)="onSubmit()">
        Salvar
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
export class EditChordSheetDialogComponent {
  title: string;
  artist: string;
  content: string;
  category: SongCategory;
  key: string;

  constructor(
    private dialogRef: MatDialogRef<EditChordSheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ChordSheet
  ) {
    this.title = data.title;
    this.artist = data.artist;
    this.content = data.content;
    this.category = data.category;
    this.key = data.key || '';
  }

  onSubmit(): void {
    this.dialogRef.close({
      title: this.title,
      artist: this.artist,
      content: this.content,
      category: this.category,
      key: this.key
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
