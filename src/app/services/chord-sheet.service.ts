import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ChordSheet, Playlist } from '../models/chord-sheet.model';

@Injectable({
  providedIn: 'root'
})
export class ChordSheetService {
  private mockChordSheets: ChordSheet[] = [
    {
      id: '1',
      title: 'A Barca',
      artist: 'Pe. Zezinho',
      category: 'Entrada',
      content: `[D]Tu, te abeiraste da praia,
[A7]Não buscaste nem sábios nem ricos,
[D]Somente queres que eu te [G]siga [D]

[D]Senhor, Tu me olhaste nos olhos,
[A7]A sorrir, pronunciaste meu nome.
[D]Lá na praia, eu larguei o meu [G]barco, [D]
Junto a Ti, buscarei outro mar.

[D]Tu, sabes bem que em meu barco,
[A7]Eu não tenho nem ouro nem espadas,
[D]Somente redes e o meu tra[G]balho [D]

[D]Tu, minhas mãos solicitas,
[A7]Meu trabalho que a outros descanse,
[D]Minha força que a outros dê [G]força [D]`,
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Eis-me Aqui Senhor',
      artist: 'Pe. Zezinho',
      category: 'Ofertório',
      content: `[C]Eis-me aqui, Se[G]nhor! Eis-me aqui, Se[C]nhor!
[F]Pra fazer Tua Vont[C]ade, pra viver do Teu A[G]mor
[F]Pra fazer Tua Vont[C]ade, pra viver do Teu a[G]mor
Eis-me aqui, Se[C]nhor!

[C]O Senhor é o Pastor que me [G]conduz
Por caminhos nunca [C]vistos me enviou
Sou chamado a ser fer[G]mento, sal e luz
E por isso respondi: aqui estou![C]`,
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Cordeiro de Deus',
      artist: 'Comunidade Católica',
      category: 'Cordeiro',
      content: `[Em]Cordeiro de Deus que tirais o pe[Am]cado do mundo
[B7]Tende piedade de [Em]nós
[Em]Cordeiro de Deus que tirais o pe[Am]cado do mundo
[B7]Tende piedade de [Em]nós
[Em]Cordeiro de Deus que tirais o pe[Am]cado do mundo
[B7]Dai-nos a paz, dai-nos a [Em]paz`,
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private currentPlaylistSubject = new BehaviorSubject<ChordSheet[]>([]);
  currentPlaylist$ = this.currentPlaylistSubject.asObservable();

  private mockPlaylists: Playlist[] = [
    {
      id: 'current',
      name: 'Atual',
      description: 'Playlist atual',
      tags: ['system'],
      chordSheets: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      isSystem: true
    },
    {
      id: 'all',
      name: 'Todas as músicas',
      description: 'Todas as músicas disponíveis',
      tags: ['system'],
      chordSheets: this.mockChordSheets,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      isSystem: true
    },
    {
      id: '1',
      name: 'Missa Domingo',
      description: 'Músicas para a missa de domingo',
      tags: ['missa', 'domingo'],
      chordSheets: [this.mockChordSheets[0], this.mockChordSheets[1]],
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  getChordSheets(): Observable<ChordSheet[]> {
    return of(this.mockChordSheets);
  }

  getChordSheet(id: string): Observable<ChordSheet | undefined> {
    return of(this.mockChordSheets.find(sheet => sheet.id === id));
  }

  createChordSheet(chordSheet: Partial<ChordSheet>): Observable<ChordSheet> {
    const newSheet: ChordSheet = {
      id: Date.now().toString(),
      title: chordSheet.title || '',
      artist: chordSheet.artist || '',
      content: chordSheet.content || '',
      category: chordSheet.category || 'Entrada',
      createdBy: chordSheet.createdBy || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockChordSheets.push(newSheet);
    const allSongsPlaylist = this.mockPlaylists.find(p => p.id === 'all');
    if (allSongsPlaylist) {
      allSongsPlaylist.chordSheets.push(newSheet);
    }
    return of(newSheet);
  }

  getPlaylists(): Observable<Playlist[]> {
    return of(this.mockPlaylists);
  }

  createPlaylist(name: string, description: string): Observable<Playlist> {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      tags: [],
      chordSheets: [],
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockPlaylists.push(newPlaylist);
    return of(newPlaylist);
  }

  updatePlaylist(playlist: Playlist): Observable<Playlist> {
    const index = this.mockPlaylists.findIndex(p => p.id === playlist.id);
    if (index !== -1) {
      this.mockPlaylists[index] = {
        ...playlist,
        updatedAt: new Date()
      };
    }
    return of(playlist);
  }

  addToCurrentPlaylist(chordSheet: ChordSheet): void {
    const currentPlaylist = this.mockPlaylists.find(p => p.id === 'current');
    if (currentPlaylist && !currentPlaylist.chordSheets.find(s => s.id === chordSheet.id)) {
      currentPlaylist.chordSheets.push(chordSheet);
      this.currentPlaylistSubject.next(currentPlaylist.chordSheets);
    }
  }

  clearCurrentPlaylist(): void {
    const currentPlaylist = this.mockPlaylists.find(p => p.id === 'current');
    if (currentPlaylist) {
      currentPlaylist.chordSheets = [];
      this.currentPlaylistSubject.next([]);
    }
  }
}