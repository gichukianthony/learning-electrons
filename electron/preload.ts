import { contextBridge, ipcRenderer } from 'electron'
import { Note, SaveNoteRequest, NotesResponse, SaveNoteResponse, DeleteNoteResponse } from '../src/types'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  loadNotes: (): Promise<NotesResponse> => ipcRenderer.invoke('load-notes'),
  saveNote: (noteData: SaveNoteRequest): Promise<SaveNoteResponse> => ipcRenderer.invoke('save-note', noteData),
  deleteNote: (noteId: string): Promise<DeleteNoteResponse> => ipcRenderer.invoke('delete-note', noteId)
})

// Type declaration for the exposed API
declare global {
  interface Window {
    electronAPI: {
      loadNotes: () => Promise<NotesResponse>
      saveNote: (noteData: SaveNoteRequest) => Promise<SaveNoteResponse>
      deleteNote: (noteId: string) => Promise<DeleteNoteResponse>
    }
  }
}
