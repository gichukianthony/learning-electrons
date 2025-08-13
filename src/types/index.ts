export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveNoteRequest {
  title: string;
  content: string;
}

export interface DeleteNoteRequest {
  id: string;
}

export interface NotesResponse {
  success: boolean;
  data?: Note[];
  error?: string;
}

export interface SaveNoteResponse {
  success: boolean;
  data?: Note;
  error?: string;
}

export interface DeleteNoteResponse {
  success: boolean;
  error?: string;
}

export interface Theme {
  mode: 'light' | 'dark';
}
