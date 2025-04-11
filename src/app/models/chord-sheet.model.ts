export interface ChordSheet {
  id: string;
  title: string;
  artist: string;
  content: string;
  category: SongCategory;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  key?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  chordSheets: ChordSheet[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isSystem?: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export type SongCategory = 
  | 'Entrada'
  | 'Ato Penitencial'
  | 'Hino de Louvor'
  | 'Aclamação ao Evangelho'
  | 'Ofertório'
  | 'Santo'
  | 'Cordeiro'
  | 'Comunhão'
  | 'Pós-Comunhão'
  | 'Final';