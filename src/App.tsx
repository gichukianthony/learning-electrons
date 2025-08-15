import React, { useState, useEffect } from 'react'
import { Note } from './types'
import NotesList from './components/NotesList'
import NoteForm from './components/NoteForm'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotes()
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const loadNotes = async () => {
    try {
      setLoading(true)
      const response = await window.electronAPI.loadNotes()
      if (response.success && response.data) {
        setNotes(response.data)
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNote = async (title: string, content: string) => {
    try {
      const response = await window.electronAPI.saveNote({ title, content })
      if (response.success && response.data) {
        setNotes(prevNotes => [...prevNotes, response.data!])
      }
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await window.electronAPI.deleteNote(id)
      if (response.success) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  if (loading) {
    return (
      <div className={`app ${theme}`}>
        <div className="loading">Loading notes...</div>
      </div>
    )
  }

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>📝 Notes App</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>
      
      <main className="main">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="content">
          <NoteForm onSave={handleSaveNote} />
          <NotesList 
            notes={filteredNotes} 
            onDelete={handleDeleteNote}
            searchTerm={searchTerm}
          />
        </div>
      </main>
    </div>
  )
}

export default App
