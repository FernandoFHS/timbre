import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chord-circle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chord-circle" 
         [class.original-key]="isOriginalKey"
         [class.current-key]="isCurrentKey">
      {{ chord }}
    </div>
  `,
  styles: [`
    .chord-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 4px;
      font-weight: bold;
      transition: all 0.2s;
    }
    .chord-circle:hover {
      background-color: #e3f2fd;
    }
    .original-key {
      border-color: #2196f3;
      background-color: #e3f2fd;
    }
    .current-key {
      border-color: #4caf50;
      background-color: #e8f5e9;
    }
  `]
})
export class ChordCircleComponent {
  @Input() chord!: string;
  @Input() isOriginalKey = false;
  @Input() isCurrentKey = false;
}
