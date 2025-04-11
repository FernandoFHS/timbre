import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChordFormatterService {
  private chordMap = new Map<string, string[]>([
    ['C', ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']],
    ['G', ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']],
    ['D', ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim']],
    ['A', ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim']],
    ['E', ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim']],
    ['F', ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim']]
  ]);

  formatChordSheet(content: string): string {
    const lines = content.split('\n');
    let formattedHtml = '';

    for (const line of lines) {
      const { chordLine, lyricLine } = this.processLine(line);
      formattedHtml += `<div class="chord-line">${chordLine}</div>`;
      formattedHtml += `<div class="lyric-line">${lyricLine}</div>`;
    }

    return formattedHtml;
  }

  private processLine(line: string): { chordLine: string; lyricLine: string } {
    const chords: string[] = [];
    const positions: number[] = [];
    let lyricLine = line;

    // Extract chords and their positions
    let match;
    const chordRegex = /\[([^\]]+)\]/g;
    while ((match = chordRegex.exec(line)) !== null) {
      chords.push(match[1]);
      positions.push(match.index);
    }

    // Remove chord markers from lyrics
    lyricLine = lyricLine.replace(/\[[^\]]+\]/g, '');

    // Build chord line with proper spacing
    let chordLine = '';
    let lastPos = 0;

    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i];
      const pos = positions[i];
      const spacing = pos - lastPos;
      chordLine += ' '.repeat(spacing) + chord;
      lastPos = pos + chord.length + 2; // +2 for the brackets
    }

    return { chordLine, lyricLine };
  }

  transposeChord(chord: string, semitones: number): string {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const baseChord = chord.replace(/m|dim|sus|maj|aug|\d/g, '');
    const suffix = chord.slice(baseChord.length);
    
    const currentIndex = notes.indexOf(baseChord);
    if (currentIndex === -1) return chord;
    
    const newIndex = (currentIndex + semitones + 12) % 12;
    return notes[newIndex] + suffix;
  }

  transposeContent(content: string, semitones: number): string {
    return content.replace(/\[([^\]]+)\]/g, (match, chord) => {
      return `[${this.transposeChord(chord, semitones)}]`;
    });
  }
}