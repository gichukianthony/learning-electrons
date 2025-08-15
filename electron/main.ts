import { app, BrowserWindow, ipcMain, dialog, Notification } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { Note, SaveNoteRequest, NotesResponse, SaveNoteResponse, DeleteNoteResponse } from '../src/types'

const isDev = process.env.IS_DEV === 'true'
const isMac = process.platform === 'darwin'

// Notes file path
const userDataPath = app.getPath('userData')
const notesDir = join(userDataPath, 'notes')
const notesFilePath = join(notesDir, 'notes.json')

// Ensure notes directory exists
if (!existsSync(notesDir)) {
    mkdirSync(notesDir, { recursive: true })
}

// Initialize notes file if it doesn't exist
if (!existsSync(notesFilePath)) {
    const initialNotes: Note[] = []
    writeFileSync(notesFilePath, JSON.stringify(initialNotes, null, 2))
}

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        titleBarStyle: isMac ? 'hiddenInset' : 'default'
    })

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(join(__dirname, '../dist/index.html'))
    }
}

// App event handlers
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// IPC handlers
ipcMain.handle('load-notes', async (): Promise<NotesResponse> => {
    try {
        if (!existsSync(notesFilePath)) {
            return { success: true, data: [] }
        }

        const data = readFileSync(notesFilePath, 'utf8')
        const notes: Note[] = JSON.parse(data)
        return { success: true, data: notes }
    } catch (error) {
        console.error('Error loading notes:', error)
        return { success: false, error: 'Failed to load notes' }
    }
})

ipcMain.handle('save-note', async (event, noteData: SaveNoteRequest): Promise<SaveNoteResponse> => {
    try {
        const notes: Note[] = existsSync(notesFilePath)
            ? JSON.parse(readFileSync(notesFilePath, 'utf8'))
            : []

        const newNote: Note = {
            id: Date.now().toString(),
            title: noteData.title,
            content: noteData.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        notes.push(newNote)
        writeFileSync(notesFilePath, JSON.stringify(notes, null, 2))

        // Show desktop notification
        if (Notification.isSupported()) {
            new Notification({
                title: 'Note Saved',
                body: `"${noteData.title}" has been saved successfully!`
            }).show()
        }

        return { success: true, data: newNote }
    } catch (error) {
        console.error('Error saving note:', error)
        return { success: false, error: 'Failed to save note' }
    }
})

ipcMain.handle('delete-note', async (event, noteId: string): Promise<DeleteNoteResponse> => {
    try {
        if (!existsSync(notesFilePath)) {
            return { success: false, error: 'Notes file not found' }
        }

        const notes: Note[] = JSON.parse(readFileSync(notesFilePath, 'utf8'))
        const filteredNotes = notes.filter(note => note.id !== noteId)

        if (filteredNotes.length === notes.length) {
            return { success: false, error: 'Note not found' }
        }

        writeFileSync(notesFilePath, JSON.stringify(filteredNotes, null, 2))
        return { success: true }
    } catch (error) {
        console.error('Error deleting note:', error)
        return { success: false, error: 'Failed to delete note' }
    }
})
